import { AddAccountModel } from '../usercases/add-account-model'

export interface AccountModel {
  id: string
  name: string
  password: string
  email: string
}
