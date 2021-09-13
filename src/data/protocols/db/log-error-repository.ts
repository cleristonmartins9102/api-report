import { AccountModel, AddAccountModel } from '../../usecases/add-account/db-account-protocols'

export interface LogErrorRepository {
  logError (stack: string): Promise<void>
}
