import { mongoHelper } from '../helper/mongo-helper'
import { Collection } from 'mongodb'
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

type SutTypes = {
  sut: AddSurveyRepository
}
const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository()
  return {
    sut
  }
}

describe('Survey MongoRepository', () => {
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

  test('Shoud return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          image: 'any_image2',
          answer: 'any_anzswer2'
        }
      ]
    })
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
