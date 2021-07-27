import { MissingParamError } from '../erros'
import { HttpResponse, HttpRequest, EmailValidator, Controller } from '../protocols'
import { badRequest, serverError } from '../helpers/http-helpers'
import { InvalidParamError } from '../erros/invalid-param-error'
import { AddAccount } from '../../../domain/usercases/add-account'

export class SignUpController implements Controller {
  emailValidator: any
  addAccount: AddAccount
  constructor (emailvalidator: EmailValidator, addAccountStub: AddAccount) {
    this.emailValidator = emailvalidator
    this.addAccount = addAccountStub
  }

  handle (httpRequest: HttpRequest): HttpResponse | any {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
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
      this.addAccount.add({
        name,
        email,
        password
      })
    } catch (error) {
      return serverError()
    }
  }
}
