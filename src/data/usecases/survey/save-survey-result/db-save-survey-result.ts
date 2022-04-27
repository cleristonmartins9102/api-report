import { SurveyResultModel } from '../../../../domain/model/survey-result-model'
import { SaveSurveyResult, SaveSurveyResultModel } from '../../../../domain/usercases/survey-result/save-survey-result'
import { SaveSurveyResultRepository } from '../../../protocols/db/survey'
import { LoadSurveyResultRepository } from '../../../protocols/db/survey/load-survey-result-repository'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepo: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepo.save(data)
    return await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId)
  }
}
