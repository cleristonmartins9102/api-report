import { AccountModel, AddAccountModel } from '../../../usecases/account/add-account/db-account-protocols'

export interface AddAccountRepository {
  add (accountData: AddAccountModel): Promise<AccountModel>
}
