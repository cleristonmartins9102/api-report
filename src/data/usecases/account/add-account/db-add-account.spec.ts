import { Hasher, AddAccountModel, AddAccountRepository, AccountModel } from './db-account-protocols'
import { DbAddAccount } from './db-add-account'

type SutType = {
  sut: DbAddAccount
  encripterStub: Hasher
  addAccountRepository: any
}

const makeEncrypter = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise(resolve => resolve('encripted_password'))
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
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

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'valid_name',
    password: 'encripted_password',
    email: 'valid_email'
  }
)

const makeFakeAccountData = (): AddAccountModel => (
  {
    name: 'valid_name',
    password: 'valid_password',
    email: 'valid_email'
  }
)

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct', async () => {
    const { sut, encripterStub } = makeSut()
    const encryptSpy = jest.spyOn(encripterStub, 'hash')
    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toBeCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, encripterStub } = makeSut()
    jest.spyOn(sut, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepository } = makeSut()
    const addSpy = jest.spyOn(addAccountRepository, 'add')
    await sut.add(makeFakeAccountData())
    expect(addSpy).toBeCalledWith(
      {
        name: 'valid_name',
        password: 'encripted_password',
        email: 'valid_email'
      }
    )
  })

  test('Should throw if Hasher throws', async () => {
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

  test('Should return an account if on success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name',
      password: 'valid_password',
      email: 'valid_email'
    }
    const account = await sut.add(accountData)
    await expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'encripted_password'
    })
  })
})
