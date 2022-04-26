import { SurveyModel } from '../../../../domain/model/survey-model'
import { SurveyResultModel } from '../../../../domain/model/survey-result-model'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../../domain/usercases/survey-result/save-survey-result'
import { InvalidParamError } from '../../../erros'
import { forbidden, ok, serverError } from '../../../helpers/http/http-helpers'
import { Controller, HttpRequest } from './save-survey-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controler'
import MockDate from 'mockdate'
import { LoadSurveyById } from '../../../../domain/usercases/survey/load-survey-by-id'

type SutTypes = {
  sut: Controller
  loadSurveyResultByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeFakeLoadSurvey = (): SurveyModel => (
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'js'
      }
    ],
    create_at: 'any_date'
  }
)

const makeSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [
    {
      answer: 'js',
      percent: 1,
      count: 1
    }
  ],
  create_at: new Date()
})

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyResultByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeLoadSurvey())
    }
  }
  return new LoadSurveyResultByIdStub()
}

const makeSaveSurveyStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeSurveyResultModel()
    }
  }
  return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyStub()
  const loadSurveyResultByIdStub = makeLoadSurveyByIdStub()
  const sut = new SaveSurveyResultController(loadSurveyResultByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyResultByIdStub,
    saveSurveyResultStub
  }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  },
  body: {
    answer: 'js'
  },
  accountId: 'any_account_id'
})

describe('Save Survey Result Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyResultById with correct value', async () => {
    const { sut, loadSurveyResultByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultByIdStub, 'loadById')
    await sut.handle(makeFakeHttpRequest())
    expect(loadSpy).toBeCalledWith('any_id')
  })

  test('Should returns 403 if LoadSurveyResultById returns null', async () => {
    const { sut, loadSurveyResultByIdStub } = makeSut()
    jest.spyOn(loadSurveyResultByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null as any))
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should returns 500 if LoadSurveyResultById throws', async () => {
    const { sut, loadSurveyResultByIdStub } = makeSut()
    jest.spyOn(loadSurveyResultByIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should returns 403 if has a wrong answer', async () => {
    const request = makeFakeHttpRequest()
    request.body.answer = 'wrong_answer'
    const { sut } = makeSut()
    const response = await sut.handle(request)
    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct value', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeHttpRequest())
    expect(saveSpy).toBeCalledWith({
      accountId: makeFakeHttpRequest().accountId,
      surveyId: makeFakeHttpRequest().params.surveyId,
      answer: makeFakeHttpRequest().body.answer,
      create_at: new Date()
    })
  })

  test('Should returns 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(ok({
      surveyId: makeFakeHttpRequest().params.surveyId,
      question: makeSurveyResultModel().question,
      answers: [
        {
          answer: 'js',
          count: 1,
          percent: 1
        }
      ],
      create_at: new Date()
    }))
  })
})
