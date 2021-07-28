import { AddAccount, AddAccountModel, AccountModel, Encrypter } from './db-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password } = account
    const data = {
      id: 'dsdsds',
      name: 'dsdsdsd',
      password: 'ewewewewe',
      email: 'dsdsd'
    }
    await this.encrypter.encrypt(password)
    return new Promise(resolve => resolve(data))
  }
}
