import { Router } from 'express'
import { makeSignUpController } from '../factories/controller/signup/signup-controller-factory'
import { routeAdapter } from '../../infra/adapters/express-route-adapter'
import { makeLoginController } from '../factories/controller/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
  router.post('/login', routeAdapter(makeLoginController()))
}
