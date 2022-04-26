import { SurveyModel } from '../../model/survey-model'

export interface LoadSurveyById {
  loadById (surveiId: string): Promise<SurveyModel>
}
