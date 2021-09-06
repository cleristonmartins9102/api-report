import { badRequest } from '../../helpers/http-helpers'
import { Controller, HttpRequest } from '../../protocols'
import { LoginController } from './login'
import { MissingParamError } from '../../erros/missing-param-error'

type SutTypes = {
  sut: Controller
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return {
    sut
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
})
