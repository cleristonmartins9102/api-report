import { Validation } from '../../../../presentation/protocols/validations'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'

export const makeSurveyValidation = (): Validation => {
  const validators: Validation[] = []
  const requiredFields = ['question', 'answers']
  for (const field of requiredFields) {
    validators.push(new RequiredFieldValidation(field))
  }
  const composite = new ValidationComposite(validators)
  return composite
}
