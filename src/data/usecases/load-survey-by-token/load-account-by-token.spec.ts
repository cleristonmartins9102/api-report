import { LoadAccountByToken } from '../../../domain/usercases/load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

type SutTypes = {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
}

const makeDecrypterStub = (): Decrypter => {
  class DecripterStub implements Decrypter {
    async decrypt (data: string): Promise<string> {
      return Promise.resolve('decrypted_token')
    }
  }
  return new DecripterStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}

describe('Load Survey By Token', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const token = 'any_token'
    await sut.load(token)
    expect(decryptSpy).toHaveBeenCalledWith(token)
  })
})
