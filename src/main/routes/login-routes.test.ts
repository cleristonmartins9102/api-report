import request from 'supertest'
import app from '../config/app'
import { mongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'

describe('Login Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.close()
  })

  beforeEach(async () => {
    const mongoCollection = await mongoHelper.getCollection('accounts')
    await mongoCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send(
          {
            name: 'cleriston',
            email: 'valid_email@gmail.com',
            password: 'valid_password',
            passwordConfirm: 'valid_password'
          }
        )
        .expect(200)
    })
  }
  )
})
