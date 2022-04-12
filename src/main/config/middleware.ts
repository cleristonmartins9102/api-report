import app from '../config/app'
import { Express } from 'express'
import { bodyParser, cors, contentType } from '../midlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
