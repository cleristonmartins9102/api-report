import { badRequest } from '../../helpers/http-helpers'
import { HttpRequest } from '../../protocols'
import { LoginController } from './login'
import { MissingParamError } from '../../erros/missing-param-error'

describe('Login Controller', () => {
  test('Should return 400 if email is not provided', async () => {
    const sut = new LoginController()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
