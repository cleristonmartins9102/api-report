import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'
import { Hasher } from '../../../data/protocols/criptography/hasher'
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('any_password'))
  },
  async compare (): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
})
)

interface Hash extends Hasher, HashComparer{}

type SutType = {
  sut: Hash
}

const makeSut = (): SutType => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut
  }
}

describe('Bcrypt Adapter', () => {
  test('Shold call hash with correct values', async () => {
    const { sut } = makeSut()
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const password = 'valid_password'
    await sut.hash(password)
    expect(encryptSpy).toHaveBeenCalledWith(password, 12)
  })

  test('Should valid hash is on hash success', async () => {
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

  test('Shold call compare with correct value', async () => {
    const { sut } = makeSut()
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    const password = 'valid_password'
    await sut.hash(password)
    expect(encryptSpy).toHaveBeenCalledWith(password, 12)
  })

  test('Shold call compare with correct value', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    const password = 'valid_password'
    await sut.compare(password, '12')
    expect(compareSpy).toHaveBeenCalledWith(password, '12')
  })

  test('Shold return true if compare on succeeds', async () => {
    const { sut } = makeSut()
    const password = 'valid_password'
    const response = sut.compare(password, '12')
    await expect(response).resolves.toBe(true)
  })

  test('Shold return false when compare fails', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare').mockReturnValueOnce((new Promise((resolve, reject) => resolve(false))) as any)
    const password = 'valid_password'
    const response = sut.compare(password, '12')
    await expect(response).resolves.toBe(false)
  })

  test('Should throw if compare throws', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare').mockReturnValueOnce((new Promise((resolve, reject) => reject(new Error()))) as any)
    const password = 'any_password'
    const response = sut.compare(password, '12')
    await expect(response).rejects.toThrow()
  })
})
