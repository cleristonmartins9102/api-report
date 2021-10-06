import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const jwtSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(jwtSpy).toBeCalledWith({ id: 'any_id' }, 'secret')
  })
})
