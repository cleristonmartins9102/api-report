import { Authentication } from '../../../../domain/usercases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAuthenticationByEmailRepository } from '../../protocols/db/load-authentication-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAuthenticationRepository: LoadAuthenticationByEmailRepository
  private readonly hashCompare: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (loadAuthenticationRepository: LoadAuthenticationByEmailRepository, hashCompare: HashComparer, tokenGenerator: TokenGenerator) {
    this.loadAuthenticationRepository = loadAuthenticationRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
  }

  async auth (email: string, password: string): Promise<string> {
    const account = await this.loadAuthenticationRepository.load(email)
    if (account) {
      const compare = await this.hashCompare.compare(password, account.password)
      await this.tokenGenerator.generate(account.id)
    }
    return null as any
  }
}
