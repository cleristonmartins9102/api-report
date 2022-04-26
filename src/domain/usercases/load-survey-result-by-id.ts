import { SurveyResultModel } from '../model/survey-result-model'

export interface LoadSurveyResultById {
  loadById (id: string): Promise<SurveyResultModel>
}
