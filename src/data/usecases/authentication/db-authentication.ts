import { Authentication } from '../../../../domain/usercases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAuthenticationByEmailRepository } from '../../protocols/db/load-authentication-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAuthenticationRepository: LoadAuthenticationByEmailRepository
  private readonly hashCompare: HashComparer

  constructor (loadAuthenticationRepository: LoadAuthenticationByEmailRepository, hashCompare: HashComparer) {
    this.loadAuthenticationRepository = loadAuthenticationRepository
    this.hashCompare = hashCompare
  }

  async auth (email: string, password: string): Promise<string> {
    const account = await this.loadAuthenticationRepository.load(email)
    if (account) {
      const compare = await this.hashCompare.compare(password, account.password)
    }
    return null as any
  }
}
