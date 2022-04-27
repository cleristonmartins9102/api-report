import { SaveSurveyResultModel } from '../../../../domain/usercases/survey-result/save-survey-result'
import { LoadSurveyResultRepository } from '../../../protocols/db/survey/load-survey-result-repository'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { SurveyResultModel } from './db-load-survey-result-protocols'
import { LoadSurveyResult } from '../../../../domain/usercases/survey-result/load-survey-result'
import { serverError } from '../../../../presentation/helpers/http/http-helpers'
import MockDate from 'mockdate'
import { LoadSurveyById, SurveyModel } from '../load-survey-by-id/load-survey-by-id-protocols'

const mockSurveyResult = (): SurveyResultModel => {
  return {
    surveyId: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        image: 'any_image',
        count: 0,
        percent: 0
      }
    ],
    create_at: new Date()
  }
}

const stubLoadSurvey = (): SurveyModel => (
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        image: 'any_image'
      }
    ],
    create_at: new Date()
  }
)

type SutTypes = {
  sut: LoadSurveyResult
  loadSurveyResultRepo: LoadSurveyResultRepository
  loadSurvey: LoadSurveyById
}

const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return mockSurveyResult()
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (surveyId: string): Promise<SurveyModel> {
      return stubLoadSurvey()
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSut = (): SutTypes => {
  const loadSurvey = mockLoadSurveyById()
  const loadSurveyResultRepo = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepo, loadSurvey)
  return {
    sut,
    loadSurveyResultRepo,
    loadSurvey
  }
}

describe('LoadSurveyResult UserCase', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  test('Should call LoadSurveyResultRepository with correct value', async () => {
    const { sut, loadSurveyResultRepo } = makeSut()
    const loadSurveyResultRepoSpy = jest.spyOn(loadSurveyResultRepo, 'loadBySurveyId')
    await sut.load('any_id')
    expect(loadSurveyResultRepoSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should returns Survey Result on success', async () => {
    const { sut } = makeSut()
    const response = await sut.load('any_id')
    expect(response).toEqual(mockSurveyResult())
  })

  test('Should returns a valid SurveyResult if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepo } = makeSut()
    jest.spyOn(loadSurveyResultRepo, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null as any))
    const response = await sut.load('any_id')
    expect(response).toEqual(mockSurveyResult())
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepo } = makeSut()
    jest.spyOn(loadSurveyResultRepo, 'loadBySurveyId').mockReturnValueOnce(Promise.reject(new Error()))
    await expect(sut.load('any_id')).rejects.toThrowError()
  })
})
