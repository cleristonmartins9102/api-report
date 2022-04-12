import { AccountModel } from '../../../usecases/account/add-account/db-account-protocols'

export interface LoadAccountByEmailRepository {
  loadByEmail (email: string): Promise<AccountModel>
}
