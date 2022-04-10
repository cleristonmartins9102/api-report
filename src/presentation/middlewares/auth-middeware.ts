import { forbidden } from '../helpers/http/http-helpers'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'
import { AccessDeniedError } from '../erros'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse | any> {
    const error = forbidden(new AccessDeniedError())
    return Promise.resolve(error)
  }
}
