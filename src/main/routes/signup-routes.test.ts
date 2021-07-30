import request from 'supertest'
import app from '../config/app'
import { mongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'

describe('SignUpRoute', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.close()
  })

  beforeEach(async () => {
    const mongoCollection = mongoHelper.getCollection('accounts')
    await mongoCollection.deleteMany({})
  })

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
