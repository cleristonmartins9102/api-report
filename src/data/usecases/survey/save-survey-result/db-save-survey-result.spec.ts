import { SurveyResultModel } from '../../../../domain/model/survey-result-model'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../../domain/usercases/survey-result/save-survey-result'
import { SaveSurveyResultRepository } from '../../../protocols/db/survey'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResult
  saveSurveyRepositoryStub: SaveSurveyResultRepository
}

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeSurveyResultModel() as any
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyRepositoryStub = makeSaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSurveyRepositoryStub)
  return {
    sut,
    saveSurveyRepositoryStub
  }
}

const makeSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      image: 'any',
      answer: 'any_answer',
      count: 1,
      percent: 1
    }
  ],
  create_at: new Date()
})

const makeSaveSurveyResultModel = (): SaveSurveyResultModel => (
  {
    surveyId: 'any_id',
    accountId: 'any_account_id',
    answer: 'any_answer',
    create_at: new Date()
  }
)

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

describe('Save Survey', () => {
  test('Shold call SaveSurveyResultRepository with correct value', async () => {
    const { sut, saveSurveyRepositoryStub } = makeSut()
    const saveSurveyRepoSpy = jest.spyOn(saveSurveyRepositoryStub, 'save')
    await sut.save(makeSaveSurveyResultModel())
    expect(saveSurveyRepoSpy).toBeCalledWith(makeSaveSurveyResultModel())
  })

  test('Shold throw if SaveSurveyRepository throws', async () => {
    const { sut, saveSurveyRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.save(makeSaveSurveyResultModel())
    await expect(response).rejects.toThrow(new Error())
  })

  test('Shold returns SuveyResult on success', async () => {
    const { sut } = makeSut()
    const response = await sut.save(makeSaveSurveyResultModel())
    expect(response).toEqual(makeSurveyResultModel())
  })
})
