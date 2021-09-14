import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/criptography/hasher'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('any_password'))
  }
})
)

type SutType = {
  sut: Hasher
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
    await sut.hash(password)
    expect(encryptSpy).toHaveBeenCalledWith(password, 12)
  })

  test('Should return hash is on success', async () => {
    const { sut } = makeSut()
    const password = 'any_password'
    const hash = await sut.hash(password)
    expect(hash).toBe(password)
  })

  test('Should bcrypt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      return new Error()
    })
    const password = 'any_password'
    const hash = sut.hash(password)
    await expect(hash).rejects.toThrow
  })
})
