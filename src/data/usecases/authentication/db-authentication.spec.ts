import { Authentication } from '../../../../domain/usercases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAuthenticationByEmailRepository } from '../../protocols/db/load-authentication-by-email-repository'
import { AccountModel, AddAccount } from '../add-account/db-account-protocols'
import { DbAuthentication } from './db-authentication'
import { AddAccountModel } from '../../../../domain/usercases/add-account-model'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  password: 'hashed_password',
  email: 'cleriston.mari@gmail.com'
})

type SutTypes = {
  loadAccountByEmailRepositoryStub: LoadAuthenticationByEmailRepository
  hashCompareStub: HashComparer
  tokenGenerator: TokenGenerator
  sut: Authentication
  updateAccessToken: UpdateAccessTokenRepository
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

const makeTokenGenerator = (): any => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return 'hash_token'
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAuthenticationByEmailStub()
  const hashCompareStub = makeCompareHash()
  const tokenGenerator = makeTokenGenerator()
  const updateAccessToken = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, tokenGenerator, updateAccessToken)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGenerator,
    updateAccessToken
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

  test('Should ensure DbAuthentication calls TokenGenerator with correct id', async () => {
    const { email, password } = makeFakeAccount()
    const { sut, tokenGenerator } = makeSut()
    const tokenGeneratorSpy = jest.spyOn(tokenGenerator, 'generate')
    await sut.auth(
      email,
      password
    )
    expect(tokenGeneratorSpy).toBeCalledWith(makeFakeAccount().id)
  })

  test('Should throw if TokenGenerator throw', async () => {
    const { email, password } = makeFakeAccount()
    const { sut, tokenGenerator } = makeSut()
    jest.spyOn(tokenGenerator, 'generate').mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(
      email,
      password
    )
    expect(promise).rejects.toThrow()
  })

  test('Should ensure returns token on success', async () => {
    const { email, password } = makeFakeAccount()
    const { sut } = makeSut()
    const accessToken = await sut.auth(
      email,
      password
    )
    expect(accessToken).toBe('hash_token')
  })

  test('Should call UpdateAccessTokenRepository with correct value', async () => {
    const { email, password, id } = makeFakeAccount()
    const { sut, updateAccessToken } = makeSut()
    const spy = jest.spyOn(updateAccessToken, 'update')
    const accessToken = await sut.auth(
      email,
      password
    )
    expect(spy).toBeCalledWith(id, 'hash_token')
  })

  test('Should throw if UpdateTokenRepository throw', async () => {
    const { email, password } = makeFakeAccount()
    const { sut, updateAccessToken } = makeSut()
    jest.spyOn(updateAccessToken, 'update').mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(
      email,
      password
    )
    expect(promise).rejects.toThrow()
  })
})
