import request from 'supertest'
import app from '../config/app'
import { mongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let mongoCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.close()
  })

  beforeEach(async () => {
    mongoCollection = await mongoHelper.getCollection('accounts')
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
  })

  describe('POST /login', () => {
    test('Should return 200 on Login', async () => {
      const secret = await hash('valid_password', 12)
      await mongoCollection.insertOne({
        name: 'cleriston',
        email: 'valid_email@gmail.com',
        password: secret
      })
      await request(app)
        .post('/api/login')
        .send(
          {
            email: 'valid_email@gmail.com',
            password: 'valid_password'
          }
        )
        .expect(200)
    })
  })
})
