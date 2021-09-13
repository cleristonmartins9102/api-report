import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/criptography/encrypter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('any_password'))
  }
})
)

type SutType = {
  sut: Encrypter
}

const makeSut = (): SutType => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut
  }
}

describe('Bcrypt Adapter', () => {
  test('Shold call bcrypt with correct value', async () => {
    const { sut } = makeSut()
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const password = 'valid_password'
    await sut.encrypt(password)
    expect(encryptSpy).toHaveBeenCalledWith(password, 12)
  })

  test('Should return hash is on success', async () => {
    const { sut } = makeSut()
    const password = 'any_password'
    const hash = await sut.encrypt(password)
    expect(hash).toBe(password)
  })

  test('Should bcrypt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      return new Error()
    })
    const password = 'any_password'
    const hash = sut.encrypt(password)
    await expect(hash).rejects.toThrow
  })
})
