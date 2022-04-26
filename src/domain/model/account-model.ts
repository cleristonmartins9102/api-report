import { AddAccountModel } from '../usercases/account/add-account-model'

export interface AccountModel {
  id: string
  name: string
  password: string
  email: string
}
