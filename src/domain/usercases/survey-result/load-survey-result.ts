import { SurveyResultModel } from '../../model/survey-result-model'

export interface LoadSurveyResult {
  load (id: string): Promise<SurveyResultModel>
}
