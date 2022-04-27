import { Controller, HttpRequest, HttpResponse, LoadSurveyResult } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly dbLoadSurveyResult: LoadSurveyResult
  ) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params } = httpRequest
    await this.dbLoadSurveyResult.load(params.surveyId)
    return null as any
  }
}
