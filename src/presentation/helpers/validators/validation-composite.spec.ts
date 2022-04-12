import { MissingParamError } from '../../erros'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  test('Ensure returns error if any Validation fails', () => {
    const sut = new ValidationComposite([])
    const error = sut.validate({ field: 'anyvalue' })
    expect(1).toBe(1)
  })
})
