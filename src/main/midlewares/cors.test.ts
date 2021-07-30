import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  app.use('/test_cors', (req, res) => {
    res.send()
  })
  test('Should parser body as json', async () => {
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-method', '*')
      .expect('access-control-allow-headers', '*')
  })
})
