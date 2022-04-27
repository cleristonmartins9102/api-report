import { LoadSurveyById } from '../load-survey-by-id/load-survey-by-id-protocols'
import { LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async load (id: string): Promise<SurveyResultModel> {
    const response = await this.loadSurveyResultRepository.loadBySurveyId(id)
    if (!response) {
      const survey = await this.loadSurveyById.loadById(id)
      survey.answers.map(element => Object.assign(element, { count: 0 }, { percent: 0 }))
      return {
        surveyId: id,
        question: survey.question,
        create_at: survey.create_at,
        answers: survey.answers as any
      }
    }
    return response
  }
}
