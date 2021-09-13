import { InvalidParamError } from '../../erros'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from '../../protocols/validations'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToCompareName: string
  private readonly emailValidator: any

  constructor (emailvalidator: EmailValidator) {
    this.emailValidator = emailvalidator
  }

  validate (input: any): Error | null {
    const isValid = this.emailValidator.isValid(input.email)
    if (!isValid) {
      return new InvalidParamError('email')
    }
    return null
  }
}
