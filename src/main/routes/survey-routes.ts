import { Router } from 'express'
import { makeSurveyController } from '../factories/controller/survey/add-survey-controller-factory'
import { routeAdapter } from '../../infra/adapters/express-route-adapter'
import Auth from '../midlewares/auth'

export default (router: Router): void => {
  router.post('/surveys', Auth.admin, routeAdapter(makeSurveyController()))
  router.get('/surveys', Auth.onlyUser, routeAdapter(makeSurveyController()))
}
