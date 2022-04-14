import { HttpRequest, HttpResponse, Controller, LoadSurvey } from './load-survey-protocols'
import { noContent, ok, serverError } from '../../../helpers/http/http-helpers'

export class LoadSurveyController implements Controller {
  constructor (
    private readonly loadSurvey: LoadSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    console.log('Rodou')
    try {
      const surveys = await this.loadSurvey.load()
      if (surveys.length === 0) {
        return noContent()
      }
      return ok(surveys)
    } catch (error) {
      console.log(error)
      return serverError(error)
    }
  }
}
