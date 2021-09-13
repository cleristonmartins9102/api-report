import { LoadAuthenticationByEmailRepository } from '../../protocols/load-authentication-by-email-repository'
import { AccountModel } from '../add-account/db-account-protocols'
import { DbAuthentication } from './db-authentication'

describe('DBAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAuthenticationByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          password: 'any_password',
          email: 'cleriston.mari@gmail.com'
        }
        return new Promise(resolve => resolve(account))
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(
      'cleriston.mari@gmail.com',
      'sw12digit'
    )
    expect(loadSpy).toHaveBeenCalledWith(
      'cleriston.mari@gmail.com'
    )
  })
})
