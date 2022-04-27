import { mongoHelper } from '../helper/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'
import { SaveSurveyResultModel } from '../../../../domain/usercases/survey-result/save-survey-result'
import { SurveyModel } from '../../../../domain/model/survey-model'
import { SaveSurveyResultRepository } from '../../../../data/protocols/db/survey'
import { LoadSurveyResultRepository } from '../../../../data/protocols/db/survey/load-survey-result-repository'

let accountCollection: Collection
let resultCollection: Collection
let surveyCollection: Collection
type LoadSurvey = SaveSurveyResultRepository | LoadSurveyResultRepository
type SutTypes = {
  sut: any
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
    question: 'What language do you prefer?',
    answers: [
      {
        answer: 'py',
        image: 'py_img'
      },
      {
        answer: 'js',
        image: 'js_img'
      },
      {
        answer: 'php',
        image: 'php_img'
      },
      {
        answer: 'java',
        image: 'java_img'
      }
    ],
    created_at: new Date()
  })
  return mongoHelper.map(res.ops[0])
}

const mockSaveResultModel = async (survey: SurveyModel, answerIdx: number = 0): Promise<SaveSurveyResultModel> => {
  return {
    surveyId: (survey as any).id,
    accountId: await mockAddAccoundModel(),
    answer: survey.answers[answerIdx].answer,
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
      await sut.save(saveResultModel)
      const response = await resultCollection.findOne({
        surveyId: survey.id
      })
      expect(response).toBeTruthy()
      expect(response.answer).toBe('py')
    })

    test('Should update SurveyResult if it is not a new record', async () => {
      const { sut } = makeSut()
      const survey = (await mockAddSurveyModel())
      const saveResultModel = await mockSaveResultModel(survey)
      await resultCollection.insertOne(saveResultModel)
      saveResultModel.answer = survey.answers[1].answer
      await sut.save(saveResultModel)
      const surveyResult = await resultCollection.findOne(
        {
          surveyId: saveResultModel.surveyId,
          accountId: saveResultModel.accountId
        }
      )
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[1].answer)
    })
  })

  describe('LoadSurveyById', () => {
    test('Should return correct SurveyResult on success', async () => {
      const { sut } = makeSut()
      const saveSurveyResultArray = []
      const survey = (await mockAddSurveyModel())
      saveSurveyResultArray.push(await mockSaveResultModel(survey) as never)
      saveSurveyResultArray.push(await mockSaveResultModel(survey) as never)
      saveSurveyResultArray.push(await mockSaveResultModel(survey) as never)
      saveSurveyResultArray.push(await mockSaveResultModel(survey, 1) as never)
      saveSurveyResultArray.push(await mockSaveResultModel(survey, 1) as never)
      saveSurveyResultArray.push(await mockSaveResultModel(survey, 2) as never)
      await resultCollection.insertMany(saveSurveyResultArray)
      const surveyResult = await sut.loadBySurveyId(survey.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].answer).toBe('py')
      expect(surveyResult.answers[0].count).toBe(3)
      expect(surveyResult.answers[1].answer).toBe('js')
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[2].answer).toBe('php')
      expect(surveyResult.answers[2].count).toBe(1)
      expect(surveyResult.answers[3].answer).toBe('java')
      expect(surveyResult.answers[3].count).toBe(0)
    })
  })
})
