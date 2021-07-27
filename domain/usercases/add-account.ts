
import { AddAccountModel } from './add-account-model'
import { AccountModel } from '../model/account-model'

export interface AddAccount {
  add (account: AddAccountModel): Promise<AccountModel>
}
