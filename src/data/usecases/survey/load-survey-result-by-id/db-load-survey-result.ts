import { LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load (id: string): Promise<SurveyResultModel> {
    const response = await this.loadSurveyResultRepository.loadBySurveyId(id)
    return response
  }
}
