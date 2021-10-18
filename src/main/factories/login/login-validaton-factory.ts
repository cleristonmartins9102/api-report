import { Validation } from '../../../presentation/protocols/validations'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../presentation/uteis/email-validator-adapter'

export const makeSignUpValidation = (): Validation => {
  const emailValidator = new EmailValidatorAdapter()
  const validators: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidation(field))
  }
  validators.push(new CompareFieldsValidation('password', 'passwordConfirm'))
  validators.push(new EmailValidation(emailValidator))
  const composite = new ValidationComposite(validators)
  return composite
}
