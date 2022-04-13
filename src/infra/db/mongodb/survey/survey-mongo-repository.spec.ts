import { mongoHelper } from '../helper/mongo-helper'
import { Collection } from 'mongodb'
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { SurveyMongoRepository } from './survey-mongo-repository'
import MockDate from 'mockdate'
import { LoadSurveyRepository } from '../../../../data/protocols/db/survey'

let surveyCollection: Collection

type SutTypes = {
  sut: any
}
const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository()
  return {
    sut
  }
}

describe('Survey MongoRepository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await mongoHelper.connect()
  })

  afterAll(async () => {
    MockDate.reset()
    await mongoHelper.close()
  })

  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
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
        ],
        created_at: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      surveyCollection.insertMany([{
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
        ],
        created_at: new Date()
      }])
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(1)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].answers[1].answer).toBe('any_anzswer2')
    })

    test('Should load an empty list', async () => {
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
})
