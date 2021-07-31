import { Router } from 'express'
import { makeSignUpController } from '../factories/signup'
import { routeAdapter } from '../../infra/adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
}
