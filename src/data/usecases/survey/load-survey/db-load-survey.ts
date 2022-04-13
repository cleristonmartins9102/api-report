import { SurveyModel } from '../../../../domain/model/survey-model'
import { LoadSurvey } from './db-load-survey-protocols'
import { LoadSurveyRepository } from '../../../protocols/db/survey/load-survey-repository'

export class DbLoadSurvey implements LoadSurvey {
  constructor (
    private readonly loadSurveyRepo: LoadSurveyRepository
  ) {}

  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveyRepo.loadAll()
    if (surveys) {
      return surveys
    }
    return Promise.resolve(null as any)
  }
}
