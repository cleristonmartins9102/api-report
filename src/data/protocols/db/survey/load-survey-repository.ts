import { SurveyModel } from '../../../../domain/model/survey-model'

export interface LoadSurveyRepository {
  load (): Promise<SurveyModel[]>
}
