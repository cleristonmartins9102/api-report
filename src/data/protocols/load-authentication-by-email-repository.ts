import { AccountModel } from '../usecases/add-account/db-account-protocols'

export interface LoadAuthenticationByEmailRepository {
  load (email: string): Promise<AccountModel>
}
