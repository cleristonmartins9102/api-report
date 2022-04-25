import { mongoHelper } from '../helper/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'
import { SaveSurveyResultModel } from '../../../../domain/usercases/save-survey-result'
import { SurveyModel } from '../../../../domain/model/survey-model'
import { SaveSurveyResultRepository } from '../../../../data/protocols/db/survey'

let accountCollection: Collection
let resultCollection: Collection
let surveyCollection: Collection

type SutTypes = {
  sut: SaveSurveyResultRepository
}
const makeSut = (): SutTypes => {
  const sut = new SurveyResultMongoRepository()
  return {
    sut
  }
}

const mockAddAccoundModel = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Cleriston',
    password: '123456',
    email: 'cleriston.mari@gmail.com'
  })
  return res.ops[0]._id
}

const mockAddSurveyModel = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'What is language do you prefer?',
    answers: [
      {
        answer: 'py'
      },
      {
        answer: 'js'
      }
    ],
    created_at: new Date()
  })
  return mongoHelper.map(res.ops[0])
}

const mockSaveResultModel = async (survey: SurveyModel): Promise<SaveSurveyResultModel> => {
  return {
    surveyId: (survey as any).id,
    accountId: await mockAddAccoundModel(),
    answer: survey.answers[0].answer,
    create_at: new Date()
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
    accountCollection = await mongoHelper.getCollection('account')
    resultCollection = await mongoHelper.getCollection('result')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
    await resultCollection.deleteMany({})
  })

  describe('Save()', () => {
    test('Should insert new SurveyResult if there is no data with surveyId and accountId', async () => {
      const { sut } = makeSut()
      const survey = (await mockAddSurveyModel())
      const saveResultModel = await mockSaveResultModel(survey)
      const surveyResult = await sut.save(saveResultModel)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].answer).toBe((survey.answers[0].answer))
    })

    test('Should update SurveyResult if it is not a new record', async () => {
      const { sut } = makeSut()
      const survey = (await mockAddSurveyModel())
      const saveResultModel = await mockSaveResultModel(survey)
      const resp = await resultCollection.insertOne(saveResultModel)
      saveResultModel.answer = survey.answers[1].answer
      const surveyResult = await sut.save(saveResultModel)
      expect(surveyResult).toBeTruthy()
    })
  })
})
