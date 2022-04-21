import request from 'supertest'
import app from '../config/app'
import { mongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import { Collection } from 'mongodb'
import { sign, verify } from 'jsonwebtoken'
import MockDate from 'mockdate'

let surveyCollection: Collection
let accountCollection: Collection

const makeInsertFakeAccount = async (): Promise<string> => {
  const accessToken = sign('any_token', 'any_secret')
  await accountCollection.insertOne({
    name: 'cleriston',
    email: 'valid_email@gmail.com',
    password: 'any_secret',
    role: 'admin',
    accessToken: accessToken
  })
  return accessToken
}

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
  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 if no access token provided', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })
})
