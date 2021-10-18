import { MissingParamError } from '../../erros'
import { badRequest, ok, serverError, unauthorizedErrorError } from '../../helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, Authentication, EmailValidator } from './login-controller-protocols'
import { InvalidParamError } from '../../erros/invalid-param-error'

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
          return badRequest(new MissingParamError(field))
        }
      }
      const emailValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!emailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const { email, password } = httpRequest.body
      const authResponse = await this.authentication.auth(email, password)
      if (!authResponse) {
        return unauthorizedErrorError()
      }
      return ok({ accessToken: authResponse })
    } catch (err) {
      return serverError(err)
    }
  }
}
