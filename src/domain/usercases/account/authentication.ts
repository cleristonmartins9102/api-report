import { AuthenticationModel } from '../../model/authentication-model'

export interface Authentication {
  auth (email: string, password: string): Promise<AuthenticationModel>
}
