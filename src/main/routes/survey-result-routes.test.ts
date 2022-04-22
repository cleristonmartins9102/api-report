import request from 'supertest'
import app from '../config/app'
import { mongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import MockDate from 'mockdate'

let surveyCollection: Collection
let accountCollection: Collection

type AccountFakeTypes = {
  accessToken: string
  id: string
}

const makeInsertFakeAccount = async (): Promise<AccountFakeTypes> => {
  const accessToken = sign('any_token', 'any_secret')
  const res = await accountCollection.insertOne({
    name: 'cleriston',
    email: 'valid_email@gmail.com',
    password: 'any_secret',
    accessToken: accessToken
  })
  const id = res.ops[0]._id
  return {
    accessToken,
    id
  }
}

const makeFakeAddSurvey = async (): Promise<string> => {
  const res = await surveyCollection.insertOne(
    {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      created_at: new Date()
    }
  )
  return res.ops[0]._id
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
  surveyCollection = await mongoHelper.getCollection('survey')
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

    test('Should return 200 access token provide', async () => {
      const idSurvey = await makeFakeAddSurvey()
      const { accessToken } = await makeInsertFakeAccount()
      await request(app)
        .put(`/api/surveys/${idSurvey}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })
})
