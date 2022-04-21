import { SurveyModel } from '../../../../domain/model/survey-model'
import { InvalidParamError } from '../../../erros'
import { forbidden, serverError } from '../../../helpers/http/http-helpers'
import { Controller, HttpRequest, LoadSurveyResultById } from './save-survey-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controler'

type SutTypes = {
  sut: Controller
  loadSurveyResultByIdStub: LoadSurveyResultById
}

const makeFakeLoadSurvey = (): SurveyModel => (
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    created_at: 'any_date'
  }
)

const makeLoadSurveyByIdStub = (): LoadSurveyResultById => {
  class LoadSurveyResultByIdStub implements LoadSurveyResultById {
    async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeLoadSurvey())
    }
  }
  return new LoadSurveyResultByIdStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyResultByIdStub = makeLoadSurveyByIdStub()
  const sut = new SaveSurveyResultController(loadSurveyResultByIdStub)
  return {
    sut,
    loadSurveyResultByIdStub
  }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  },
  body: {
    answer: 'wrong_answer'
  }
})

describe('Save Survey Result Controller', () => {
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
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })
})
