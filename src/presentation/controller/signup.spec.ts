import { SignUpController } from './signUpController'

describe('Signup  Controller', () => {
  test('Should return 400 if name not provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      email: 'cleriston.mari@gmail.com',
      password: 'any_password',
      passwordConfirm: 'any_password'
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing name'))
  })
})
