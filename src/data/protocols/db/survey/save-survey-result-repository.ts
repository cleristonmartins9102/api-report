import { SurveyResultModel } from '../../../../domain/model/survey-result-model'
import { SaveSurveyResultModel } from '../../../../domain/usercases/survey-result/save-survey-result'

export interface SaveSurveyResultRepository {
  save (data: SaveSurveyResultModel): Promise<void>
}
