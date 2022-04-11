import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
describe('Load Survey By Token', () => {
  test('Should call Decrypter with correct value', async () => {
    class DecripterStub implements Decrypter {
      async decrypt (data: string): Promise<string> {
        return Promise.resolve('decrypted_token')
      }
    }
    const decripterStub = new DecripterStub()
    const decryptSpy = jest.spyOn(decripterStub, 'decrypt')
    const token = 'any_token'
    const sut = new DbLoadAccountByToken(decripterStub)
    await sut.load(token)
    expect(decryptSpy).toHaveBeenCalledWith(token)
  })
})
