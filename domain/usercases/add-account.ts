
import { AddAccountModel } from './add-account-model'
import { AccountModel } from '../model/account-model'
import { AddAccountRepository } from '../../src/data/protocols/db/account/add-account-repository'

export interface AddAccount {
  add (account: AddAccountModel): Promise<AccountModel>
}
