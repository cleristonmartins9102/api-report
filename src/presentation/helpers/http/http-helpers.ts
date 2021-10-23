import { ServerError } from '../../erros/server-error'
import { UnauthorizedError } from '../../erros/unauthorized-error'
import { HttpResponse } from '../../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({ statusCode: 400, body: error })
export const forbidden = (error: Error): HttpResponse => ({ statusCode: 403, body: error })
/* istanbul ignore next */
export const serverError = (error?: Error): HttpResponse => ({ statusCode: 500, body: new ServerError(error?.stack as string) })
export const unauthorizedErrorError = (): HttpResponse => ({ statusCode: 401, body: new UnauthorizedError() })
export const ok = (data: any): HttpResponse => ({ statusCode: 200, body: data })
