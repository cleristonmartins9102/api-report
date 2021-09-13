import { Authentication } from '../../../../domain/usercases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAuthenticationByEmailRepository } from '../../protocols/db/load-authentication-by-email-repository'
import { AccountModel, AddAccount } from '../add-account/db-account-protocols'
import { DbAuthentication } from './db-authentication'
import { AddAccountModel } from '../../../../domain/usercases/add-account-model'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  password: 'hashed_password',
  email: 'cleriston.mari@gmail.com'
})

type SutTypes = {
  loadAccountByEmailRepositoryStub: LoadAuthenticationByEmailRepository
  hashCompareStub: HashComparer
  sut: Authentication
}

const makeLoadAuthenticationByEmailStub = (): LoadAuthenticationByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAuthenticationByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount()
      return new Promise(resolve => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeCompareHash = (): any => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAuthenticationByEmailStub()
  const hashCompareStub = makeCompareHash()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub
  }
}

describe('DBAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { email, password } = makeFakeAccount()
    const { sut, hashCompareStub, loadAccountByEmailRepositoryStub } = makeSut()
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
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(
      email,
      password
    )
    expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { email, password } = makeFakeAccount()
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null as any)
    const accessToken = await sut.auth(
      email,
      password
    )
    console.log(accessToken)
    expect(accessToken).toBeNull()
  })

  test('Should ensure DBAuthentication call HashComparer with correct value', async () => {
    const { email } = makeFakeAccount()
    const password = 'any_password'
    const { sut, hashCompareStub } = makeSut()
    const hashCompareStubSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(
      email,
      password
    )
    expect(hashCompareStubSpy).toBeCalledWith(password, 'hashed_password')
  })

  test('Should throw if HashCompare throw', async () => {
    const { email, password } = makeFakeAccount()
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(
      email,
      password
    )
    expect(promise).rejects.toThrow()
  })

  test('Should ensure DbAuthentication returns null if HashComparer returns false', async () => {
    const { email, password } = makeFakeAccount()
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockResolvedValueOnce(new Promise(resolve => resolve(false)))
    const hash = await sut.auth(
      email,
      password
    )
    expect(hash).toBeNull()
  })
})
