import { AddAccountRepository } from '../../protocols/add-account-repository'
import { AddAccount, AddAccountModel, AccountModel, Encrypter } from './db-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const { password } = accountData
    const hatchedPassword = await this.encrypter.encrypt(password)
    await this.addAccountRepository.add({ ...accountData, password: hatchedPassword })
    return new Promise(resolve => resolve({ ...accountData, id: 'dsdsd' }))
  }
}
