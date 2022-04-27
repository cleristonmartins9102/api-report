import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorator/log-signup-controller-decorator'
import { makeDbSaveSurveyResult } from '../../usercases/survey/db-save-survey-result/db-save-survey-result-factory'
import { makeDbLoadSurveyById } from '../../usercases/survey/db-load/db-load-survey-by-id-factory'
import { SaveSurveyResultController } from '../../../../presentation/controller/survey/survey-result/save/save-survey-result-controler'

export const makeSaveSurveyResultController = (): Controller => {
  const loadSurveyResult = makeDbLoadSurveyById()
  const controller = new SaveSurveyResultController(loadSurveyResult, makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
