import { Validation } from '../../../../presentation/protocols/validations'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { makeSurveyValidation } from './survey-validaton-factory'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'

jest.mock('../../../../validation/validators/validation-composite')

describe('SurveyValidation Factory', () => {
  test.only('Should call ValidationComposite with all validations', () => {
    makeSurveyValidation()
    const validators: Validation[] = []
    const requiredFields = ['question', 'answers']
    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toBeCalledWith(validators)
  })
})
