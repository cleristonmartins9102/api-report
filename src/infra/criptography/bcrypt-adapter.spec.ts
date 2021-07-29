import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

describe('Bcrypt Adapter', () => {
  test('Shold call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const password = 'valid_password'
    await sut.encrypt(password)
    expect(encryptSpy).toHaveBeenCalledWith(password, 12)
  })
})
