import { Encrypter } from '../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../data/protocols/criptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    const token = await jwt.sign({
      id: value
    }, this.secret)
    return Promise.resolve(token)
  }

  async decrypt (value: string): Promise<string> {
    try {
      const token = jwt.verify(value, this.secret)
      if (token) {
        return Promise.resolve(token as string)
      }
      return Promise.resolve(null as any)
    } catch (error) {
      return null as any
    }
  }
}
