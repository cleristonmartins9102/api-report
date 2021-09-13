import { Authentication } from '../../../../domain/usercases/authentication'
import { LoadAuthenticationByEmailRepository } from '../../protocols/db/load-authentication-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAuthenticationRepository: LoadAuthenticationByEmailRepository

  constructor (loadAuthenticationRepository: LoadAuthenticationByEmailRepository) {
    this.loadAuthenticationRepository = loadAuthenticationRepository
  }

  async auth (email: string, password: string): Promise<string> {
    await this.loadAuthenticationRepository.load(email)
    return null as any
  }
}
