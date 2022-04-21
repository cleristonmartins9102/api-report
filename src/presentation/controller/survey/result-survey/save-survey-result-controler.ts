import { Controller, HttpRequest, HttpResponse } from './save-survey-controller-protocols'
import { LoadSurveyResultById } from '../../../../domain/usercases/load-survey-result-by-id'
import { forbidden, ok } from '../../../helpers/http/http-helpers'
import { InvalidParamError } from '../../../erros'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyResult: LoadSurveyResultById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyResult.loadById(httpRequest.params.surveyId)
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    return ok('')
  }
}
