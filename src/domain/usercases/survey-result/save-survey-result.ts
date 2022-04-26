import { SurveyResultModel } from '../../model/survey-result-model'

export type SaveSurveyResultModel = {
  surveyId: string
  accountId: string
  answer: string
  create_at: Date
}
export interface SaveSurveyResult {
  save (data: SaveSurveyResultModel): Promise<SurveyResultModel>
}
