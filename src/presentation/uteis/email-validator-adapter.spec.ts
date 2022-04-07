import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'
import { EmailValidator } from '../../validation/protocols/email-validator'

jest.mock('validator', () => ({
  isEmail: (): boolean => {
    return true
  }
}))

type SutType = {
  sut: EmailValidator
}

const makeSut = (): SutType => {
  const sut = new EmailValidatorAdapter()
  return {
    sut
  }
}

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const { sut } = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const { sut } = makeSut()
    const isValid = sut.isValid('cleriston.mari@gmail.com')

    expect(isValid).toBe(true)
  })

  test('Should validator receive correct email', () => {
    const { sut } = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const email = 'cleriston.mari@gmail.com'
    sut.isValid(email)
    expect(isEmailSpy).toBeCalledWith(email)
  })
})
