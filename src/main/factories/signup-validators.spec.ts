import { Validation } from '../../presentation/protocols/validations'
import { CompareFieldsValidation } from '../../presentation/helpers/validations/compare-fields-validation'
import { EmailValidation } from '../../presentation/helpers/validations/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validations/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validations/validation-composite'
import { EmailValidatorAdapter } from '../../presentation/uteis/email-validator-adapter'
import { makeSignUpValidation } from './signup-validators'

jest.mock('../../presentation/helpers/validations/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const emailValidator = new EmailValidatorAdapter()
    const validators: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
    for (const field of requiredFields) {
      validators.push(new RequiredFieldValidation(field))
    }
    validators.push(new CompareFieldsValidation('password', 'passwordConfirm'))
    validators.push(new EmailValidation(emailValidator))
    expect(ValidationComposite).toBeCalledWith(validators)
  })
})
