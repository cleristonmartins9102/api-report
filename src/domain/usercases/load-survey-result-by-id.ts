import { SurveyModel } from '../model/survey-model'

export interface LoadSurveyResult {
  loadById (id: string): Promise<SurveyModel>
}
