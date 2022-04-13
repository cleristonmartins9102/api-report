import { SurveyModel } from '../../../../domain/model/survey-model'
import { LoadSurvey } from './db-load-survey-protocols'
import { LoadSurveyRepository } from '../../../protocols/db/survey/load-survey-repository'

export class DbLoadSurvey implements LoadSurvey {
  constructor (
    private readonly loadSurveyRepo: LoadSurveyRepository
  ) {}

  async load (): Promise<SurveyModel[]> {
    await this.loadSurveyRepo.load()
    return Promise.resolve(null as any)
  }
}
