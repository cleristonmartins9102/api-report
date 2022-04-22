import { HttpRequest, HttpResponse } from '../../presentation/protocols'
import { NextFunction, Request, Response } from 'express'
import { Middleware } from '../../presentation/protocols/middleware'

export const middlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      header: req.headers
    }
    const httpResponse: HttpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      req.accountId = httpResponse.body.accountId
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
