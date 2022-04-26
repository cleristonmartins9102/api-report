import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorator/log-signup-controller-decorator'
import { SaveSurveyResultController } from '../../../../presentation/controller/survey/result-survey/save-survey-result-controler'
import { makeDbSaveSurveyResult } from '../../usercases/survey/db-save-survey-result/db-save-survey-result-factory'
import { makeDbLoadSurveyById } from '../../usercases/survey/db-load/db-load-survey-by-id-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const loadSurvey = makeDbLoadSurveyById()
  const controller = new SaveSurveyResultController(loadSurvey, makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
