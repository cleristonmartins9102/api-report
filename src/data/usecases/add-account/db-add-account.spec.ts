import { Encrypter, AddAccountModel, AddAccountRepository, AccountModel } from './db-account-protocols'
import { DbAddAccount } from './db-add-account'

type SutType = {
  sut: DbAddAccount
  encripterStub: Encrypter
  addAccountRepository: any
}

const makeEncrypter = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('encripted_password'))
    }
  }
  return new EncryptStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'e2dsds',
        name: 'cleriston',
        password: 'sw12digit',
        email: 'cleriston.mari@gmail.com'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutType => {
  const addAccountRepository = makeAddAccountRepository()
  const encripterStub = makeEncrypter()
  const sut = new DbAddAccount(encripterStub, addAccountRepository)
  return {
    sut,
    encripterStub,
    addAccountRepository
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

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepository } = makeSut()
    const addSpy = jest.spyOn(addAccountRepository, 'add')
    const accountData = {
      name: 'valid_name',
      password: 'encripted_password',
      email: 'valid_email@gmail.com'
    }
    await sut.add(accountData)
    expect(addSpy).toBeCalledWith(accountData)
  })
})
