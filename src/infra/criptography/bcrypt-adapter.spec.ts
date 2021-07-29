import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('any_password'))
  }
})
)

describe('Bcrypt Adapter', () => {
  test('Shold call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const password = 'valid_password'
    await sut.encrypt(password)
    expect(encryptSpy).toHaveBeenCalledWith(password, 12)
  })

  test('Should return hash is on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const password = 'any_password'
    const hash = await sut.encrypt(password)
    expect(hash).toBe(password)
  })
})
