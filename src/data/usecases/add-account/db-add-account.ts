import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { AddAccount, AddAccountModel, AccountModel, Hasher } from './db-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const { password } = accountData
    const hatchedPassword = await this.hasher.hash(password)
    const account = this.addAccountRepository.add({ ...accountData, password: hatchedPassword })
    return new Promise(resolve => resolve(account))
  }
}
