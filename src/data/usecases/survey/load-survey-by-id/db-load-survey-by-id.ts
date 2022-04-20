import { SurveyModel } from '../../../../domain/model/survey-model'
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveyResultById } from './load-survey-by-id-protocols'

export class DbLoadSurveyResultById implements LoadSurveyResultById {
  constructor (
    private readonly loadSurveyByIdRepo: LoadSurveyByIdRepository
  ) {}

  async loadById (id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepo.loadById(id)
    return survey
  }
}
