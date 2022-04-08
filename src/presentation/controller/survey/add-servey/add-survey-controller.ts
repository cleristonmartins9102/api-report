import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from './add-survey-controller-protocols'
import { Validation } from '../../../protocols/validations'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helpers'
import { AddSurvey } from '../../../../domain/usercases/add-survey'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse | any> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
