import { SurveyModel } from '../model/survey-model'

export interface LoadSurvey {
  load (): Promise<SurveyModel[]>
}
