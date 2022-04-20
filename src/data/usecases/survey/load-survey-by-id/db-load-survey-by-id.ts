import { SurveyModel } from '../../../../domain/model/survey-model'
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveyResultById } from './load-survey-by-id-protocols'

export class DbLoadSurveyResultById implements LoadSurveyResultById {
  constructor (
    private readonly loadSurveyByIdRepo: LoadSurveyByIdRepository
  ) {}

  async loadById (id: string): Promise<SurveyModel> {
    await this.loadSurveyByIdRepo.loadById(id)
    return Promise.resolve(null as any)
  }
}
