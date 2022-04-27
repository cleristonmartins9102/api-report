import { noContent, ok, serverError } from '../../../../helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, LoadSurveyResult } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly dbLoadSurveyResult: LoadSurveyResult
  ) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params } = httpRequest
      const surveyResult = await this.dbLoadSurveyResult.load(params.surveyId)
      if (surveyResult) {
        return ok(surveyResult)
      } else {
        return noContent()
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
