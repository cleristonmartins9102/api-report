import { Express, Router } from 'express'
import fb from 'fast-glob'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // fb.sync('**/src/main/routes/**routes.ts').map(async file => {
  //   (await import(`../../../${file}`)).default(router)
  // })
  const dir = path.join(__dirname, '../routes')
  readdirSync(dir).map(async file => {
    if (!file.endsWith('.map') && (file.includes('-routes.ts') || file.includes('-routes.js'))) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
