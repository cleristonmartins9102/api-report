import { MissingParamError } from '../erros/missing-param-error'
import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest } from '../helpers/http-helpers'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../erros/invalid-param-error'

export class SignUpController implements Controller {
  emailValidator: any
  constructor (emailvalidator: EmailValidator) {
    this.emailValidator = emailvalidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return badRequest(new InvalidParamError('email'))
  }
}
