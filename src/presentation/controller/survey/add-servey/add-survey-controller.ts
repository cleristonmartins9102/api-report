import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from './add-survey-controller-protocols'
import { Validation } from '../../../protocols/validations'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    return new Promise(resolve => {
      resolve({
        statusCode: 1,
        body: 'any_body'
      })
    })
  }
}
