import { Router } from 'express'
import { makeSurveyController } from '../factories/controller/survey/add-survey-controller-factory'
import { routeAdapter } from '../../infra/adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/survey', routeAdapter(makeSurveyController()))
}
