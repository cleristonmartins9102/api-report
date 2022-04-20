import { SurveyModel } from '../../../../domain/model/survey-model'
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository'
import { DbLoadSurveyResultById } from './db-load-survey-by-id'
import { LoadSurveyResultById } from './load-survey-by-id-protocols'

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

type SutTypes = {
  sut: LoadSurveyResultById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return makeFakeLoadSurvey()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyResultById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('Load Survey By Id', () => {
  describe('load()', () => {
    test('Should call LoadSurveyByIdRepository', async () => {
      const { sut, loadSurveyByIdRepositoryStub } = makeSut()
      const loadSurveyRepositorySpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      await sut.loadById('any_id')
      expect(loadSurveyRepositorySpy).toBeCalled()
    })

    test('Should returns survey on sucess', async () => {
      const { sut } = makeSut()
      const response = await sut.loadById('any_id')
      expect(response).toEqual(makeFakeLoadSurvey())
    })
  })
})
