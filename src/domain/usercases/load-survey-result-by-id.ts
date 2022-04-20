import { SurveyModel } from '../model/survey-model'

export interface LoadSurveyResultById {
  loadById (id: string): Promise<SurveyModel>
}
