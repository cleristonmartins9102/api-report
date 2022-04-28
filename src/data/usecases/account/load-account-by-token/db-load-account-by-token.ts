import { LoadAccountByToken } from '../../../../domain/usercases/account/load-account-by-token'
import { Decrypter } from '../../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    let token: any = null
    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return token
    }
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return Promise.resolve(null as any)
  }
}
