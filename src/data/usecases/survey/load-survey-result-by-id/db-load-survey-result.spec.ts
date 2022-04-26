import { SaveSurveyResultModel } from '../../../../domain/usercases/survey-result/save-survey-result'
import { LoadSurveyResultRepository } from '../../../protocols/db/survey/load-survey-result-repository'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { SurveyResultModel } from './db-load-survey-result-protocols'

describe('LoadSurveyResult UserCase', () => {
  test('Should call LoadSurveyResultRepository with correct value', async () => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      async loadById (surveyId: string): Promise<SurveyResultModel> {
        return {
          surveyId: 'any_id',
          question: 'any_question',
          answers: [
            {
              answer: 'any_answer',
              image: 'any_image',
              count: 1,
              percent: 100
            }
          ],
          create_at: new Date()
        }
      }
    }
    const loadSurveyResultRepo = new LoadSurveyResultRepositoryStub()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepo)
    const loadSurveyResultRepoSpy = jest.spyOn(loadSurveyResultRepo, 'loadById')
    await sut.load('any_id')
    expect(loadSurveyResultRepoSpy).toHaveBeenCalledWith('any_id')
  })
})
