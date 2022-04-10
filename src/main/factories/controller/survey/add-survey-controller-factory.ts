import { Controller } from '../../../../presentation/protocols'
import { makeSurveyValidation } from './survey-validaton-factory'
import { makeDbAddSurvey } from '../../usercases/db-add-survey/db-add-survey-factory'
import { makeLogControllerDecorator } from '../../decorator/log-signup-controller-decorator'
import { AddSurveyController } from '../../../../presentation/controller/survey/add-servey/add-survey-controller'

export const makeSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
