import { SurveyModel } from '../../../../domain/model/survey-model'
import { SaveSurveyResultModel } from '../../../../domain/usercases/save-survey-result'

export interface SaveSurveyResultRepository {
  save (data: SaveSurveyResultModel): Promise<SaveSurveyResultModel>
}
