import { LoadAccountByToken } from '../../../../domain/usercases/account/load-account-by-token'
import { Decrypter } from '../../../protocols/criptography/decrypter'
import { AccountModel } from '../add-account/db-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../../protocols/db/account/load-account-by-token-repository'

type SutTypes = {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'valid_name',
    password: 'encripted_password',
    email: 'valid_email'
  }
)

const makeDecrypterStub = (): Decrypter => {
  class DecripterStub implements Decrypter {
    async decrypt (data: string): Promise<string> {
      return Promise.resolve('decrypted_token')
    }
  }
  return new DecripterStub()
}

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (tokn: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('Db Load Account By Token', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const token = 'any_token'
    await sut.load(token)
    expect(decryptSpy).toHaveBeenCalledWith(token)
  })

  test('Should returns throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const token = 'any_token'
    const error = await sut.load(token, 'any_role')
    expect(error).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct value', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    const token = 'decrypted_token'
    await sut.load(token, 'any_role')
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith(token, 'any_role')
  })

  test('Should returns throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.reject(new Error()))
    const token = 'any_token'
    const error = sut.load(token, 'any_role')
    await expect(error).rejects.toThrow(new Error())
  })

  test('Should returns an account on success', async () => {
    const { sut } = makeSut()
    const token = 'decrypted_token'
    const account = await sut.load(token, 'any_role')
    expect(account).toEqual(makeFakeAccount())
  })
})
