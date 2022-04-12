import { MissingParamError } from '../../presentation/erros'
import { RequiredFieldValidation } from './required-field-validation'

type SutTypes = {
  sut: RequiredFieldValidation
}

const makeSut = (required: string): SutTypes => {
  const sut = new RequiredFieldValidation(required)
  return {
    sut
  }
}

const makeFakeRequest = {
  body: {
    name: 'any_name'
  }
}

describe('Required Field', () => {
  test('Ensure Validate method return correct response', () => {
    const { sut } = makeSut('password')
    expect(sut.validate(makeFakeRequest.body)).toEqual(new MissingParamError('password'))
  })
})
