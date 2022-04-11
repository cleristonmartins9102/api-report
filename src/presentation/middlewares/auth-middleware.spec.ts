import { Middleware } from '../protocols/middleware'
import { forbidden } from '../helpers/http/http-helpers'
import { AccessDeniedError } from '../erros/access-denied-error'
import { AuthMiddleware } from './auth-middeware'
import { AccountModel } from '../../domain/model/account-model'
import { LoadAccountByToken } from '../../domain/usercases/load-account-by-token'

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'valid_name',
    password: 'encripted_password',
    email: 'valid_email'
  }
)

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByTokenStub()
}

describe('Auth Middleware', () => {
  test('Shoud return 403 if no x-access-token exists in headers', async () => {
    const sut: Middleware = new AuthMiddleware(makeLoadAccountByToken())
    const response = await sut.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Shoud call LoadAccountByToken with correct value', async () => {
    const loadAccountByToken = makeLoadAccountByToken()
    const loadSpy = jest.spyOn(loadAccountByToken, 'load')
    const sut: Middleware = new AuthMiddleware(loadAccountByToken)
    await sut.handle({
      header: {
        'x-access-token': 'any_token'
      }
    })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
