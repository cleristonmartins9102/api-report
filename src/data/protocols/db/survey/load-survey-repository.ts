import { SurveyModel } from '../../../../domain/model/survey-model'

export interface LoadSurveyRepository {
  loadAll (): Promise<SurveyModel[]>
}
