import { InvalidParamError, MissingParamError, ServerError } from '../erros'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signUpController'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class ValidatorEmailStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new ValidatorEmailStub()
}

const makeEmailValidatorError = (): EmailValidator => {
  class ValidatorEmailStub implements EmailValidator {
    isValid (email: string): boolean {
      throw new Error()
    }
  }
  return new ValidatorEmailStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Signup  Controller', () => {
  test('Should return 400 if name not provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'cleriston.mari@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if email not provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'cleriston',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if password not provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'cleriston',
        email: 'cleriston.mari@gmail.com',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if passwordConfirm not provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'cleriston',
        email: 'cleriston.mari@gmail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'cleriston',
        email: 'invalid.mari@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValid = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'cleriston',
        email: 'invalid.mari@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValid).toHaveBeenCalledWith('invalid.mari@gmail.com')
  })

  test('Should return 500 if EmailValidator throws', () => {
    const emailValidatorStub = makeEmailValidatorError()
    const sut = new SignUpController(emailValidatorStub)
    const httpRequest = {
      body: {
        name: 'cleriston',
        email: 'invalid.mari@gmail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
