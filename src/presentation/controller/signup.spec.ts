import { MissingParamError } from '../erros/missing-param-error'
import { SignUpController } from './signUpController'

describe('Signup  Controller', () => {
  test('Should return 400 if name not provided', () => {
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
})
