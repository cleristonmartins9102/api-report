import { SurveyModel } from '../../../../domain/model/survey-model'
import { LoadSurveyRepository } from '../../../protocols/db/survey/load-survey-repository'
import { DbLoadSurvey } from './db-load-survey'
import { LoadSurvey } from '../../../../domain/usercases/load-survey'

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
  sut: LoadSurvey
  loadSurveyRepositoryStub: LoadSurveyRepository
}

const makeLoadSurveyRepositoryStub = (): LoadSurveyRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return makeFakeLoadSurvey()
    }
  }
  return new LoadSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = makeLoadSurveyRepositoryStub()
  const sut = new DbLoadSurvey(loadSurveyRepositoryStub)
  return {
    sut,
    loadSurveyRepositoryStub
  }
}

describe('Db Load Survey', () => {
  test('Should call LoadSurveyRepository', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadSurveyRepositorySpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSurveyRepositorySpy).toBeCalled()
  })

  test('Should returns list of surveys on sucess', async () => {
    const { sut } = makeSut()
    const response = await sut.load()
    expect(response).toEqual(makeFakeLoadSurvey())
  })
})
