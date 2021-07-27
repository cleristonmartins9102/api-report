import { MissingParamError } from '../erros'
import { HttpResponse, HttpRequest, EmailValidator, Controller } from '../protocols'
import { badRequest, serverError } from '../helpers/http-helpers'
import { InvalidParamError } from '../erros/invalid-param-error'

export class SignUpController implements Controller {
  emailValidator: any
  constructor (emailvalidator: EmailValidator) {
    this.emailValidator = emailvalidator
  }

  handle (httpRequest: HttpRequest): HttpResponse | any {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password, passwordConfirm } = httpRequest.body
      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
