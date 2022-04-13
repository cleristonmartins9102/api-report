import { HttpRequest, HttpResponse, Controller, LoadSurvey } from './load-survey-protocols'
import { ok } from '../../../helpers/http/http-helpers'

export class LoadSurveyController implements Controller {
  constructor (
    private readonly loadSurvey: LoadSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurvey.load()
    return ok(surveys)
  }
}
