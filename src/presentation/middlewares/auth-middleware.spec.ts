import { Middleware } from '../protocols/middleware'
import { forbidden } from '../helpers/http/http-helpers'
import { AccessDeniedError } from '../erros/access-denied-error'
import { AuthMiddleware } from './auth-middeware'

describe('Auth Middleware', () => {
  test('Shoud return 403 if no x-access-token exists in headers', async () => {
    const sut: Middleware = new AuthMiddleware()
    const response = await sut.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
