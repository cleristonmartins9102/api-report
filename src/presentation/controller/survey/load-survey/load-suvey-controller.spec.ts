import { LoadSurveyController } from './load-survey-controller'
import { LoadSurvey, Controller } from './load-survey-protocols'
import { SurveyModel } from '../../../../domain/model/survey-model'
import MockDate from 'mockdate'
import { noContent, ok, serverError } from '../../../helpers/http/http-helpers'

const makeFakeLoadSurvey = (): SurveyModel[] => (
  [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      create_at: 'any_date'
    }
  ]
)

type SutTypes = {
  sut: Controller
  loadSurveyStub: LoadSurvey
}

const makeLoadSurveyStub = (): LoadSurvey => {
  class LoadSurveyStub implements LoadSurvey {
    async load (): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeLoadSurvey())
    }
  }
  return new LoadSurveyStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyStub = makeLoadSurveyStub()
  const sut = new LoadSurveyController(loadSurveyStub)
  return {
    sut,
    loadSurveyStub
  }
}

beforeAll(() => {
  MockDate.set(new Date())
})

afterAll(() => {
  MockDate.reset()
})

describe('Load Survey', () => {
  test('Should call LoadSurvey', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const loadSurveyStubSpy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle({})
    expect(loadSurveyStubSpy).toHaveBeenCalled()
  })

  test('Should return 204 if LoadSurvey retyrbs zero poll', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const response = await sut.handle({})
    expect(response).toEqual(noContent())
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(ok(makeFakeLoadSurvey()))
  })

  test('Should LoadSurveysController throws if LoadSurvey fails', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })
})
