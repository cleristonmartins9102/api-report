import { LoadSurveyResultController } from '../../../../presentation/controller/survey/survey-result/load/load-surver-result-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeDbLoadSurveyResult } from '../../usercases/survey/db-load-survey-result/db-load-survey-result'

export const makeLoadSurveyResultController = (): Controller => {
  const dbSurveyResult = makeDbLoadSurveyResult()
  const loadSurveyResultController = new LoadSurveyResultController(dbSurveyResult)
  return loadSurveyResultController
}
