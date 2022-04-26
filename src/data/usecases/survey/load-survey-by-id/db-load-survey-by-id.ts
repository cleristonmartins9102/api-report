import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository'
import { SurveyResultModel } from '../load-survey-result-by-id/db-load-survey-result-protocols'
import { LoadSurveyResultById } from './load-survey-by-id-protocols'

export class DbLoadSurveyResultById implements LoadSurveyResultById {
  constructor (
    private readonly loadSurveyByIdRepo: LoadSurveyByIdRepository
  ) {}

  async loadById (id: string): Promise<SurveyResultModel> {
    const survey = await this.loadSurveyByIdRepo.loadById(id)
    return survey as any
  }
}
