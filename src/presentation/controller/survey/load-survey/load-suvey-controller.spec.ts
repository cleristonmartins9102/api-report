import { LoadSurveyController } from './load-survey-controller'
import { LoadSurvey, Controller } from './load-survey-protocols'
import { SurveyModel } from '../../../../domain/model/survey-model'
import MockDate from 'mockdate'

const makeFakeLoadSurveyModel = (): SurveyModel[] => (
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
      created_at: 'any_date'
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
      return Promise.resolve(makeFakeLoadSurveyModel())
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
})
