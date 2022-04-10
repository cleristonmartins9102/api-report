import request from 'supertest'
import app from '../config/app'
import { mongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.close()
  })

  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  describe('POST /survey', () => {
    test('Should return 204 on add survey', async () => {
      await request(app)
        .post('/api/survey')
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
            ]
          }
        )
        .expect(204)
    })
  })
})
