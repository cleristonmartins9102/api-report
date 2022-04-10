import { HttpRequest, HttpResponse } from './http'

export interface Midleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>
}
