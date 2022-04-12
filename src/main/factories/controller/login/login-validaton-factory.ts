import { EmailValidatorAdapter } from '../../../../presentation/uteis/email-validator-adapter'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'

export const makeLoginValidation = (): EmailValidator => {
  const emailValidator = new EmailValidatorAdapter()
  return emailValidator
}
