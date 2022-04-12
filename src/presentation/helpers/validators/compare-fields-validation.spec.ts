import { InvalidParamError } from '../../erros'
import { Validation } from '../../protocols/validations'
import { CompareFieldsValidation } from './compare-fields-validation'
type SutTypes = {
  sut: Validation
}

const makeSut = (fieldName: string, fieldToCompare: string): SutTypes => {
  const sut = new CompareFieldsValidation(fieldName, fieldToCompare)
  return {
    sut
  }
}

const makeFakeRequest = {
  body: {
    name: 'any_name',
    password: 'any_password',
    passwordConfirm: 'wrong_password'
  }
}

describe('Compare Validation', () => {
  test('Ensure Validate method returns correct value', () => {
    const fieldToCompare = 'passwordConfirm'
    const error = new InvalidParamError(fieldToCompare)
    const { sut } = makeSut('password', fieldToCompare)
    expect(sut.validate(makeFakeRequest.body)).toEqual(error)
  })
})
