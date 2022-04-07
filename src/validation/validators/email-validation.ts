import { InvalidParamError } from '../../presentation/erros'
import { EmailValidator } from '../protocols/email-validator'
import { Validation } from '../../presentation/protocols/validations'

export class EmailValidation implements Validation {
  constructor (private readonly emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  validate (input: any): Error | null {
    const isValid = this.emailValidator.isValid(input.email)
    if (!isValid) {
      return new InvalidParamError('email')
    }
    return null
  }
}
