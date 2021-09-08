import { MissingParamError } from '../../erros'
import { badRequest } from '../http-helpers'
import { Validation } from '../validations'

export class ValidationComposite implements Validation {
  private readonly validations
  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (input: any): Error | null {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
    return null
  }
}
