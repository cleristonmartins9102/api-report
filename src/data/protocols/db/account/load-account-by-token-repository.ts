import { AccountModel } from '../../../usecases/add-account/db-account-protocols'

export interface LoadAccountByTokenRepository {
  loadByToken (token: string, role?: string): Promise<AccountModel>
}
