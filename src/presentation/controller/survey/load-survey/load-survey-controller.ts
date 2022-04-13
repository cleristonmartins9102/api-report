import { HttpRequest, HttpResponse, Controller, LoadSurvey } from './load-survey-protocols'

export class LoadSurveyController implements Controller {
  constructor (
    private readonly loadSurvey: LoadSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurvey.load()
    return Promise.resolve(null as any)
  }
}
