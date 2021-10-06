import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return new Promise(resolve => resolve('any_token'))
  }
}))

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const jwtSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(jwtSpy).toBeCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret')
    const token = await sut.encrypt('any_id')
    expect(token).toBe('any_token')
  })
})
