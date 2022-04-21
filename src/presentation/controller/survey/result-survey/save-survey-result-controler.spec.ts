import { SurveyModel } from '../../../../domain/model/survey-model'
import { InvalidParamError } from '../../../erros'
import { forbidden } from '../../../helpers/http/http-helpers'
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

describe('Save Survey Result Controller', () => {
  test('Should call LoadSurveyResultById with correct value', async () => {
    const httpRequest: HttpRequest = {
      params: {
        surveyId: 'any_id'
      }
    }
    const { sut, loadSurveyResultByIdStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultByIdStub, 'loadById')
    await sut.handle(httpRequest)
    expect(loadSpy).toBeCalledWith('any_id')
  })

  test('Should returns 403 if LoadSurveyResultById returns null', async () => {
    const httpRequest: HttpRequest = {
      params: {
        surveyId: 'any_id'
      }
    }
    const { sut, loadSurveyResultByIdStub } = makeSut()
    jest.spyOn(loadSurveyResultByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null as any))
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})
