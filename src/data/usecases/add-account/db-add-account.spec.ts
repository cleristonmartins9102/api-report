import { AddAccount } from '../../../../domain/usercases/add-account'
import { AddAccountModel } from '../../../../domain/usercases/add-account-model'
import { AccountModel } from '../../../../domain/model/account-model'
import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

type SutType = {
  sut: AddAccount
  encripterStub: Encrypter
}

const makeSut = (): SutType => {
  class EncryptStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('encripted_password'))
    }
  }
  const encripterStub = new EncryptStub()
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
    const accountData: AddAccountModel = {
      name: 'cleriston',
      password: 'sw12digit',
      email: 'cleriston.mari@gmail.com'
    }
    await sut.add(accountData)
    expect(encryptSpy).toBeCalledWith('sw12digit')
  })
})
