import { Validation } from '../../../../presentation/protocols/validations'
import { CompareFieldsValidation } from '../../../../validation/validators/compare-fields-validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../../presentation/uteis/email-validator-adapter'
import { makeSignUpValidation } from '../../controller/signup/signup-validaton-factory'

jest.mock('../../../../validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test.only('Should call ValidationComposite with all validations', () => {
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
