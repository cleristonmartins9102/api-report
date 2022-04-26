import { SurveyResultModel } from '../model/survey-result-model'

export interface LoadSurveyResult {
  load (surveiId: string): Promise<SurveyResultModel>
}
