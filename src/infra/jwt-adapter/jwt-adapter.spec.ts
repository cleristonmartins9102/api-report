import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return new Promise(resolve => resolve('any_token'))
  },
  verify: async (): Promise<string> => {
    return new Promise(resolve => resolve('decoded_token'))
  }
}))

const makeSut = (): JwtAdapter => new JwtAdapter('secret')

describe('JWT Adapter', () => {
  describe('Sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const jwtSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(jwtSpy).toBeCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      const token = await sut.encrypt('any_id')
      expect(token).toBe('any_token')
    })

    test('Should throw if Jwt throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('Decode()', () => {
    test('Should call decode with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toBeCalledWith('any_token', 'secret')
    })
  })
})
