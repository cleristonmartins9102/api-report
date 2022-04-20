import { mongoHelper } from '../helper/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'
import { SaveSurveyResultModel } from '../../../../domain/usercases/save-survey-result'
import { SurveyModel } from '../../../../domain/model/survey-model'

let accountCollection: Collection
let resultCollection: Collection
let surveyCollection: Collection

type SutTypes = {
  sut: any
}
const makeSut = (): SutTypes => {
  const sut = new SurveyResultMongoRepository()
  return {
    sut
  }
}

const makeFakeAddAccoundModel = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Cleriston',
    password: '123456',
    email: 'cleriston.mari@gmail.com'
  })
  return res.ops[0]._id
}

const makeFakeAddSurveyModel = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'What is language do you prefer?',
    answers: [
      {
        answer: 'py'
      }
    ],
    created_at: new Date()
  })
  return res.ops[0]
}

const makeFakeSaveResultModel = async (survey: SurveyModel): Promise<SaveSurveyResultModel> => {
  return {
    surveyId: (survey as any)._id,
    accountId: await makeFakeAddAccoundModel(),
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
      const survey = (await makeFakeAddSurveyModel())
      const saveResultModel = await makeFakeSaveResultModel(survey)
      const surveyResult = await sut.save(saveResultModel)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe((survey.answers[0].answer))
    })
  })
})
