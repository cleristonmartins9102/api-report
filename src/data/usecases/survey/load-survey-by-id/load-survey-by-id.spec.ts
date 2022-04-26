import { SurveyModel } from '../../../../domain/model/survey-model'
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyById } from './load-survey-by-id-protocols'

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
    create_at: 'any_date'
  }
)

type SutTypes = {
  sut: LoadSurveyById
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
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
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

    test('Should throw if LoadSurveyByIdRepository throws', async () => {
      const { sut, loadSurveyByIdRepositoryStub } = makeSut()
      jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
      const response = sut.loadById('any_id')
      await expect(response).rejects.toThrow(new Error())
    })
  })
})
