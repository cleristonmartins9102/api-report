import { LoadSurveyResultById, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResultById implements LoadSurveyResultById {
  constructor (
    private readonly loadSurveyResult: LoadSurveyResultById
  ) {}

  async loadById (id: string): Promise<SurveyResultModel> {
    await this.loadSurveyResult.loadById(id)
    return null as any
  }
}
