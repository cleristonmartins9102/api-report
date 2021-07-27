import { AddAccountModel } from '../usercases/add-account-model'

export interface AccountModel extends AddAccountModel {
  id: string
}
