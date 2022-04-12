import request from 'supertest'
import app from '../config/app'
import { mongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

// describe('Survey Routes', () => {
describe('POST /surveys', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.close()
  })

  afterEach(async () => {
    surveyCollection = await mongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

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
          ]
        }
      )
      .expect(403)
  })
})
// })
