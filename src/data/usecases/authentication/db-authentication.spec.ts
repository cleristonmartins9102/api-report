import { LoadAuthenticationByEmailRepository } from '../../protocols/db/load-authentication-by-email-repository'
import { AccountModel } from '../add-account/db-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  password: 'any_password',
  email: 'cleriston.mari@gmail.com'
})

const makeLoadAuthenticationByEmailStub = (): LoadAuthenticationByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAuthenticationByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount()
      return new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

describe('DBAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { email, password } = makeFakeAccount()
    const loadAccountByEmailRepositoryStub = makeLoadAuthenticationByEmailStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(
      email,
      password
    )
    expect(loadSpy).toHaveBeenCalledWith(
      email
    )
  })

  test('Should throw if LoadAccountByEmailRepository throw', async () => {
    const { email, password } = makeFakeAccount()
    const loadAccountByEmailRepositoryStub = makeLoadAuthenticationByEmailStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(
      email,
      password
    )
    expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { email, password } = makeFakeAccount()
    const loadAccountByEmailRepositoryStub = makeLoadAuthenticationByEmailStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null as any)
    const accessToken = await sut.auth(
      email,
      password
    )
    expect(accessToken).toBeNull()
  })
})
