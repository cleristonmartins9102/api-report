import { Validation } from '../../presentation/helpers/validations'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): Validation => {
  const fields: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
  for (const field of requiredFields) {
    fields.push(new RequiredFieldValidation(field))
  }
  const composite = new ValidationComposite(fields)
  return composite
}
