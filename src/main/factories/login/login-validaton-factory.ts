import { Validation } from '../../../presentation/protocols/validations'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../presentation/uteis/email-validator-adapter'
import { EmailValidator } from '../../../presentation/protocols/email-validator'

export const makeLoginValidation = (): EmailValidator => {
  const emailValidator = new EmailValidatorAdapter()
  return emailValidator
}
