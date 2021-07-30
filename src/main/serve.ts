import { mongoHelper } from '../infra/db/mongodb/helper/mongo-helper'
import env from '../main/config/dev'

mongoHelper.connect(env.mongoURL).then(async () => {
  const app = (await import('../main/config/app')).default
  app.listen(env.port, () => console.log(`Server is running at http://localhost:${env.port}`))
}).catch(console.error)
