import { Authentication, HashComparer, Encrypter, LoadAccountByEmailRepository, UpdateAccessTokenRepository, AuthenticationModel } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAuthenticationRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessToken: UpdateAccessTokenRepository
  ) {
    this.loadAuthenticationRepository = loadAuthenticationRepository
    this.hashCompare = hashCompare
    this.encrypter = encrypter
    this.updateAccessToken = updateAccessToken
  }

  async auth (email: string, password: string): Promise<AuthenticationModel> {
    const account = await this.loadAuthenticationRepository.loadByEmail(email)
    if (account) {
      const isValid = await this.hashCompare.compare(password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessToken.updateAccessToken(account.id, accessToken)
        return {
          accessToken: accessToken,
          name: account.name
        }
      }
    }
    return null as any
  }
}
