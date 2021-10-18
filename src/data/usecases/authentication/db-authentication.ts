import { Authentication } from '../../../../domain/usercases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAuthenticationRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessToken: UpdateAccessTokenRepository

  constructor (loadAuthenticationRepository: LoadAccountByEmailRepository, hashCompare: HashComparer, encrypter: Encrypter, updateAccessTokenRepository: UpdateAccessTokenRepository) {
    this.loadAuthenticationRepository = loadAuthenticationRepository
    this.hashCompare = hashCompare
    this.encrypter = encrypter
    this.updateAccessToken = updateAccessTokenRepository
  }

  async auth (email: string, password: string): Promise<string> {
    const account = await this.loadAuthenticationRepository.loadByEmail(email)
    if (account) {
      const isValid = await this.hashCompare.compare(password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessToken.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null as any
  }
}
