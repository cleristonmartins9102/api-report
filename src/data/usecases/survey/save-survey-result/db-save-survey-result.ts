import { SurveyResultModel } from '../../../../domain/model/survey-result-model'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../../domain/usercases/save-survey-result'
import { SaveSurveyResultRepository } from '../../../protocols/db/survey'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepo: SaveSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepo.save(data)
    return Promise.resolve(null as any)
  }
}
