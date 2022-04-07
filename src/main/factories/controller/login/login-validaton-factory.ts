import { EmailValidatorAdapter } from '../../../../presentation/uteis/email-validator-adapter'
import { EmailValidator } from '../../../../validation/protocols/email-validator'

export const makeLoginValidation = (): EmailValidator => {
  const emailValidator = new EmailValidatorAdapter()
  return emailValidator
}
