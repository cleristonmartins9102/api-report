import { badRequest } from '../../helpers/http-helpers'
import { Controller, HttpRequest } from '../../protocols'
import { LoginController } from './login'
import { MissingParamError } from '../../erros/missing-param-error'
import { EmailValidator } from '../../protocols/email-validator'

type SutTypes = {
  sut: Controller
  emailValidator: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()
  const sut = new LoginController(emailValidator)
  return {
    sut,
    emailValidator
  }
}

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
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  test('Should call EmailValidator with call correct value', async () => {
    const { sut, emailValidator } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidator, 'isValid')
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(emailValidatorSpy).toBeCalledWith('any_email')
  })
})
