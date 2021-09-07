import { MissingParamError } from '../../erros'
import { badRequest, ok, serverError } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../erros/invalid-param-error'
import { Authentication } from '../../../../domain/usercases/authentication'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fieldRequired = ['email', 'password']
      for (const field of fieldRequired) {
        if (!httpRequest.body[field]) {
          return new Promise(resolve => resolve(badRequest(new MissingParamError(field))))
        }
      }
      const emailValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!emailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const { email, password } = httpRequest.body
      await this.authentication.auth(email, password)
      return ok('success')
    } catch (err) {
      return serverError(err)
    }
  }
}
