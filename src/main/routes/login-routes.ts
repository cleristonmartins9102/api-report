import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { routeAdapter } from '../../infra/adapters/express-route-adapter'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
  router.post('/login', routeAdapter(makeLoginController()))
}
