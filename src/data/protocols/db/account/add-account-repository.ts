import { AccountModel, AddAccountModel } from '../../../usecases/add-account/db-account-protocols'

export interface AddAccountRepository {
  add (accountData: AddAccountModel): Promise<AccountModel>
}
