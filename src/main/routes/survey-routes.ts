import { Router } from 'express'
import { makeSurveyController } from '../factories/controller/survey/add-survey-controller-factory'
import { routeAdapter } from '../../infra/adapters/express-route-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { middlewareAdapter } from '../../infra/adapters/express-middleware-adapter'

export default (router: Router): void => {
  const authAdmin = middlewareAdapter(makeAuthMiddleware('admin'))
  router.post('/surveys', authAdmin, routeAdapter(makeSurveyController()))
}
