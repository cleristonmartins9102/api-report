import { HttpResponse, HttpRequest, Controller, AddAccount } from './signup-controller-protocols'
import { badRequest, serverError, ok, forbidden } from '../../../helpers/http/http-helpers'
import { Validation } from '../../../protocols/validations'
import { Authentication } from '../../../../domain/usercases/account/authentication'
import { EmailInUseError } from '../../../erros'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {
    this.addAccount = addAccount
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return forbidden(new EmailInUseError(email))
      }

      const token = await this.authentication.auth(email, password)
      return ok({ accessToken: token })
    } catch (error) {
      return serverError(error)
    }
  }
}
