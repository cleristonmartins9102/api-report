import { Router } from 'express'
import { makeSurveyController } from '../factories/controller/survey/add-survey-controller-factory'
import { routeAdapter } from '../../infra/adapters/express-route-adapter'
import Auth from '../midlewares/auth'
import { makeLoadSurveyController } from '../factories/controller/survey/load-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', Auth.admin, routeAdapter(makeSurveyController()))
  router.get('/surveys', Auth.onlyUser, routeAdapter(makeLoadSurveyController()))
}
