import { badRequest, ok, serverError, unauthorizedErrorError } from '../../../helpers/http/http-helpers'
import { Controller, HttpRequest, Authentication, EmailValidator } from './login-controller-protocols'
import { LoginController } from './login-controller'
import { MissingParamError } from '../../../erros/missing-param-error'
import { InvalidParamError } from '../../../erros'

type SutTypes = {
  sut: Controller
  emailValidator: EmailValidator
  authenticationStub: Authentication
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return Promise.resolve('token')
    }
  }
  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidator, authenticationStub)
  return {
    sut,
    emailValidator,
    authenticationStub
  }
}

const makeFakeHttpRequest = (): any => ({
  body: {
    email: 'any_email@gmail.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()
    const httpRequest: HttpRequest = makeFakeHttpRequest()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with call correct value', async () => {
    const { sut, emailValidator } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidator, 'isValid')
    const httpRequest: HttpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(emailValidatorSpy).toBeCalledWith('any_email@gmail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce((email: string) => {
      throw new Error('any_error')
    })
    const httpRequest: HttpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error('any_error')))
  })

  test('Should call Authenticator with call correct value', async () => {
    const { sut, authenticationStub } = makeSut()
    const authenticationStubSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest: HttpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(authenticationStubSpy).toBeCalledWith('any_email@gmail.com', 'any_password')
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null as any)))
    const httpRequest: HttpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorizedErrorError())
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

  test('Should return 200 if Authenthication on success', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'token' }))
  })
})
