import { HttpResponse, HttpRequest, Controller, AddAccount } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helpers'
import { Validation } from '../../helpers/validations'

export class SignUpController implements Controller {
  addAccount: AddAccount
  validation: Validation

  constructor (addAccountStub: AddAccount, validation: Validation) {
    this.addAccount = addAccountStub
    this.validation = validation
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
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
