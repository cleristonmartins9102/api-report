import { forbidden, ok, serverError } from '../helpers/http/http-helpers'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'
import { AccessDeniedError } from '../erros'
import { LoadAccountByToken } from '../../domain/usercases/load-account-by-token'
export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse | any> {
    try {
      const accessToken = httpRequest.header?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({
            accountId: account.id
          })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
