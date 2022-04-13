import { HttpRequest, HttpResponse, Controller, LoadSurvey } from './load-survey-protocols'
import { ok, serverError } from '../../../helpers/http/http-helpers'

export class LoadSurveyController implements Controller {
  constructor (
    private readonly loadSurvey: LoadSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
