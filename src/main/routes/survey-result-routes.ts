import { Router } from 'express'
import { routeAdapter } from '../../infra/adapters/express-route-adapter'
import Auth from '../midlewares/auth'
import { makeSaveSurveyResultController } from '../factories/controller/survey-result/save-survey-result'
import { makeLoadSurveyResultController } from '../factories/controller/survey-result/load-survey-result'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', Auth.onlyUser, routeAdapter(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', Auth.onlyUser, routeAdapter(makeLoadSurveyResultController()))
}
