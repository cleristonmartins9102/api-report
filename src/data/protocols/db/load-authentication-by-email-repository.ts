import { AccountModel } from '../../usecases/add-account/db-account-protocols'

export interface LoadAuthenticationByEmailRepository {
  loadByEmail (email: string): Promise<AccountModel>
}
