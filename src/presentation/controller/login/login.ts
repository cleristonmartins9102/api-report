import { MissingParamError } from '../../erros'
import { badRequest, ok } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const fieldRequired = ['email', 'password']
    for (const field of fieldRequired) {
      if (!httpRequest.body[field]) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError(field))))
      }
    }
    this.emailValidator.isValid(httpRequest.body.email)
    return ok('success')
  }
}
