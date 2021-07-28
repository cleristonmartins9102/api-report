import { Encrypter } from './db-account-protocols'
import { DbAddAccount } from './db-add-account'

type SutType = {
  sut: DbAddAccount
  encripterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('encripted_password'))
    }
  }
  return new EncryptStub()
}

const makeSut = (): SutType => {
  const encripterStub = makeEncrypter()
  const sut = new DbAddAccount(encripterStub)
  return {
    sut,
    encripterStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct', async () => {
    const { sut, encripterStub } = makeSut()
    const encryptSpy = jest.spyOn(encripterStub, 'encrypt')
    const accountData = {
      name: 'cleriston',
      password: 'sw12digit',
      email: 'cleriston.mari@gmail.com'
    }
    await sut.add(accountData)
    expect(encryptSpy).toBeCalledWith('sw12digit')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encripterStub } = makeSut()
    jest.spyOn(sut, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'cleriston',
      password: 'sw12digit',
      email: 'cleriston.mari@gmail.com'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
