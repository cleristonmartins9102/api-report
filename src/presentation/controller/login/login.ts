import { MissingParamError } from '../../erros'
import { badRequest, ok } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const fieldRequired = ['email', 'password']
    for (const field of fieldRequired) {
      if (!httpRequest.body[field]) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError(field))))
      }
    }
    return ok('success')
  }
}
