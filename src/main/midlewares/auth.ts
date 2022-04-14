import { middlewareAdapter } from '../../infra/adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default {
  admin: middlewareAdapter(makeAuthMiddleware('admin')),
  onlyUser: middlewareAdapter(makeAuthMiddleware())
}
