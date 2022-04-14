import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorator/log-signup-controller-decorator'
import { LoadSurveyController } from '../../../../presentation/controller/survey/load-survey/load-survey-controller'
import { makeDbLoadSurvey } from '../../usercases/survey/db-add-survey/db-load-survey-factory'

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveyController(makeDbLoadSurvey())
  return makeLogControllerDecorator(controller)
}
