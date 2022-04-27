import { SurveyResultModel, SurveyModel, LoadSurveyResultRepository, LoadSurveyById, LoadSurveyResult, Controller, HttpRequest } from './load-survey-result-controller-protocols'
import { LoadSurveyResultController } from './load-surver-result-controller'
import { ok, serverError } from '../../../../helpers/http/http-helpers'

const stubSurveyResult = (): SurveyResultModel => {
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
  sut: Controller
  // loadSurveyResultRepo: LoadSurveyResultRepository
  // loadSurvey: LoadSurveyById
  dbLoadSurveyResult: LoadSurveyResult
}

const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return stubSurveyResult()
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

const mockDbLoadSurveyResult = (): LoadSurveyResult => {
  class DbLoadSurveyResult implements LoadSurveyResult {
    async load (id: string): Promise<SurveyResultModel> {
      return stubSurveyResult()
    }
  }
  return new DbLoadSurveyResult()
}

const stubHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

const makeSut = (): SutTypes => {
  const dbLoadSurveyResult = mockDbLoadSurveyResult()
  const sut = new LoadSurveyResultController(dbLoadSurveyResult)
  return {
    sut,
    dbLoadSurveyResult
  }
}

describe('LoadSurveyResult Controller', () => {
  test('Should call DbLoadSurveyResult usercase with correct value', async () => {
    const { sut, dbLoadSurveyResult } = makeSut()
    const dbLoadSurveyResultSpy = jest.spyOn(dbLoadSurveyResult, 'load')
    await sut.handle(stubHttpRequest())
    expect(dbLoadSurveyResultSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should DbLoadSurveyResult returns 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(stubHttpRequest())
    expect(response).toEqual(ok(stubSurveyResult()))
  })

  test('Should throw if DbLoadSurveyResult throws', async () => {
    const { sut, dbLoadSurveyResult } = makeSut()
    jest.spyOn(dbLoadSurveyResult, 'load').mockImplementationOnce(() => {
      throw new Error('any_error')
    })
    const response = await sut.handle(stubHttpRequest())
    expect(response).toEqual(serverError(new Error('any_error')))
  })
})
