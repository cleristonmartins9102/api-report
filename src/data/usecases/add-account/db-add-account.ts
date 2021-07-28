import { AddAccount } from '../../../../domain/usercases/add-account'
import { AddAccountModel } from '../../../../domain/usercases/add-account-model'
import { AccountModel } from '../../../../domain/model/account-model'
import { Encrypter } from '../../protocols/encrypter'

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
