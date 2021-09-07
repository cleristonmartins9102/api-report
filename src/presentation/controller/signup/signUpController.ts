import { MissingParamError } from '../../erros'
import { HttpResponse, HttpRequest, EmailValidator, Controller, AddAccount } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'
import { InvalidParamError } from '../../erros/invalid-param-error'
import { Validation } from '../../helpers/validations'

export class SignUpController implements Controller {
  emailValidator: any
  addAccount: AddAccount
  validation: Validation
  constructor (emailvalidator: EmailValidator, addAccountStub: AddAccount, validation: Validation) {
    this.emailValidator = emailvalidator
    this.addAccount = addAccountStub
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirm } = httpRequest.body
      if (password !== passwordConfirm) {
        return badRequest(new InvalidParamError('passwordConfirm'))
      }
      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

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
