import { Authentication } from '../../../../domain/usercases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { LoadAuthenticationByEmailRepository } from '../../protocols/db/load-authentication-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAuthenticationRepository: LoadAuthenticationByEmailRepository
  private readonly hashCompare: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessToken: UpdateAccessTokenRepository

  constructor (loadAuthenticationRepository: LoadAuthenticationByEmailRepository, hashCompare: HashComparer, encrypter: Encrypter, updateAccessTokenRepository: UpdateAccessTokenRepository) {
    this.loadAuthenticationRepository = loadAuthenticationRepository
    this.hashCompare = hashCompare
    this.encrypter = encrypter
    this.updateAccessToken = updateAccessTokenRepository
  }

  async auth (email: string, password: string): Promise<string> {
    const account = await this.loadAuthenticationRepository.load(email)
    if (account) {
      const isValid = await this.hashCompare.compare(password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessToken.update(account.id, accessToken)
        return accessToken
      }
    }
    return null as any
  }
}
