import { InvalidParamError, MissingParamError, ServerError } from '../../erros'
import { EmailValidator } from '../../protocols/email-validator'
import { SignUpController } from './signup-controller'
import { AddAccountModel } from '../../../domain/usercases/add-account-model'
import { AddAccount } from '../../../domain/usercases/add-account'
import { AccountModel } from '../../../domain/model/account-model'
import { HttpRequest } from '../../protocols'
import { badRequest, ok, serverError } from '../../helpers/http/http-helpers'
import { Validation } from '../../protocols/validations'
import { Authentication } from '../login/login-controller-protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => (
  {
    body: {
      name: 'cleriston',
      email: 'cleriston.mari@gmail.com',
      password: 'any_password',
      passwordConfirm: 'any_password'
    }
  }
)

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
)

const makeEmailValidator = (): EmailValidator => {
  class ValidatorEmailStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new ValidatorEmailStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return Promise.resolve('token')
    }
  }
  return new AuthenticationStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeFakeHttpRequest = (): any => ({
  body: {
    email: 'any_email@gmail.com',
    password: 'any_password'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null as any
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const addAccountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('Signup  Controller', () => {
  // test('Should return 400 if an invalid email is provided', async () => {
  //   const { sut, emailValidatorStub } = makeSut()
  //   jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  // })

  // test('Should call EmailValidator with correct email', async () => {
  //   const { sut, emailValidatorStub } = makeSut()
  //   const isValid = jest.spyOn(emailValidatorStub, 'isValid')
  //   await sut.handle(makeFakeRequest())
  //   expect(isValid).toHaveBeenCalledWith('cleriston.mari@gmail.com')
  // })

  // test('Should return 500 if EmailValidator throws', async () => {
  //   const { sut, emailValidatorStub } = makeSut()
  //   jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
  //     throw new Error()
  //   })
  //   const httpResponse = await sut.handle(makeFakeRequest())
  //   expect(httpResponse).toEqual(serverError(new ServerError('email')))
  // })

  test('Should call AddAccount with corret data', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'cleriston',
      email: 'cleriston.mari@gmail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validation with corret data', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const error = new Error('invalid_email')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(error))
  })

  test('Should call Authenticator with call correct value', async () => {
    const { sut, authenticationStub } = makeSut()
    const authenticationStubSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest: HttpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(authenticationStubSpy).toBeCalledWith('any_email@gmail.com', 'any_password')
  })

  test('Should return 500 if Authenthication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce((email: string) => {
      throw new Error('any_error')
    })
    const httpRequest: HttpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })
})
