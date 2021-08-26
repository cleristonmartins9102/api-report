import { AccountModel, AddAccountModel } from '../usecases/add-account/db-account-protocols'

export interface LogErrorRepository {
  log (stack: string): Promise<void>
}
