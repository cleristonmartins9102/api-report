import { Middleware } from '../../../presentation/protocols/middleware'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middeware'
import { makeDbLoadAccountByToken } from '../usercases/account/db-load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const loadAccountByToken = makeDbLoadAccountByToken()
  return new AuthMiddleware(loadAccountByToken, role)
}
