import { SaveSurveyResultModel } from '../../../../domain/usercases/survey-result/save-survey-result'
import { LoadSurveyResultRepository } from '../../../protocols/db/survey/load-survey-result-repository'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { SurveyResultModel } from './db-load-survey-result-protocols'
import { LoadSurveyResult } from '../../../../domain/usercases/survey-result/load-survey-result'
import { serverError } from '../../../../presentation/helpers/http/http-helpers'

const mockSurveyResult = (): SurveyResultModel => {
  return {
    surveyId: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        image: 'any_image',
        count: 1,
        percent: 100
      }
    ],
    create_at: new Date()
  }
}

type SutTypes = {
  sut: LoadSurveyResult
  loadSurveyResultRepo: LoadSurveyResultRepository
}

const stubLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadById (surveyId: string): Promise<SurveyResultModel> {
      return mockSurveyResult()
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepo = stubLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepo)
  return {
    sut,
    loadSurveyResultRepo
  }
}

describe('LoadSurveyResult UserCase', () => {
  test('Should call LoadSurveyResultRepository with correct value', async () => {
    const { sut, loadSurveyResultRepo } = makeSut()
    const loadSurveyResultRepoSpy = jest.spyOn(loadSurveyResultRepo, 'loadById')
    await sut.load('any_id')
    expect(loadSurveyResultRepoSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepo } = makeSut()
    jest.spyOn(loadSurveyResultRepo, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    await expect(sut.load('any_id')).rejects.toThrowError()
  })
})
