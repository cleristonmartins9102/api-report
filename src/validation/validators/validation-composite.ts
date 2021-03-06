import { Validation } from '../../presentation/protocols/validations'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {
    this.validations = validations
  }

  validate (input: any): Error | null {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      /* istanbul ignore next */
      if (error) {
        return error
      }
    }
    return null
  }
}
