import request from 'supertest'
import app from '../config/app'
import { mongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import { Collection } from 'mongodb'
import { sign, verify } from 'jsonwebtoken'
import MockDate from 'mockdate'

let surveyCollection: Collection
let accountCollection: Collection

beforeAll(async () => {
  MockDate.set(new Date())
  await mongoHelper.connect()
})

afterAll(async () => {
  MockDate.reset()
  await mongoHelper.close()
})

afterEach(async () => {
  surveyCollection = await mongoHelper.getCollection('surveys')
  accountCollection = await mongoHelper.getCollection('accounts')
  await surveyCollection.deleteMany({})
  await accountCollection.deleteMany({})
})

describe('Survey Routes', () => {
  describe('POST /surveys', () => {
    test('Should return 403 on add surveys on success', async () => {
      await request(app)
        .post('/api/surveys')
        .send(
          {
            question: 'Question',
            answers: [
              {
                image: 'any_image1',
                answer: 'any_answer1'
              },
              {
                image: 'any_image2',
                answer: 'any_answer2'
              }
            ],
            created_at: new Date()
          }
        )
        .expect(403)
    })

    test('Should return 204 on add surveys on success', async () => {
      const res = await accountCollection.insertOne({
        name: 'cleriston',
        email: 'valid_email@gmail.com',
        password: 'any_secret',
        role: 'admin',
        accessToken: 'any_token'
      })
      const accessToken = sign('any_token', 'any_secret')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(
          {
            question: 'Question',
            answers: [
              {
                image: 'any_image1',
                answer: 'any_answer1'
              },
              {
                image: 'any_image2',
                answer: 'any_answer2'
              }
            ],
            created_at: new Date()
          }
        )
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load survey without token', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 on load surveys if token is provided', async () => {
      await accountCollection.insertOne({
        name: 'cleriston',
        email: 'valid_email@gmail.com',
        password: 'any_secret',
        accessToken: 'any_token'
      })
      const accessToken = sign('any_token', 'any_secret')
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
