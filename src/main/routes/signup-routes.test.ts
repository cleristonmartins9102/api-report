import request from 'supertest'
import app from '../config/app'

describe('SignUpRoutes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .get('/api/signup')
      .send(
        {
          nome: 'cleriston',
          email: 'valid_email',
          password: 'valid_password',
          passwordConfirm: 'valid_password'
        }
      )
      .expect(200)
  })
})
