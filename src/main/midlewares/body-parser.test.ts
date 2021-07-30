import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  app.use('/test_body_parser', (req, res) => {
    res.send(req.body)
  })
  test('Should parser body as json', async () => {
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'cleriston' })
      .expect({ name: 'cleriston' })
  })
})
