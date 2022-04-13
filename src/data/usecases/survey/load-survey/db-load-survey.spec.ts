import { SurveyModel } from '../../../../domain/model/survey-model'
import { LoadSurveyRepository } from '../../../protocols/db/survey/load-survey-repository'
import { DbLoadSurvey } from './db-load-survey'

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
      created_at: 'any_date'
    }
  ]
)

describe('Db Load Survey', () => {
  test('Should call LoadSurveyRepository', async () => {
    class LoadSurveyRepositoryStub implements LoadSurveyRepository {
      async load (): Promise<SurveyModel[]> {
        return makeFakeLoadSurvey()
      }
    }
    const loadSurveyRepositoryStub = new LoadSurveyRepositoryStub()
    const sut = new DbLoadSurvey(loadSurveyRepositoryStub)
    const loadSurveyRepositorySpy = jest.spyOn(loadSurveyRepositoryStub, 'load')
    await sut.load()
    expect(loadSurveyRepositorySpy).toBeCalled()
  })
})
