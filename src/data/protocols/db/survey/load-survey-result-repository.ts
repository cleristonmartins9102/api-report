import { SurveyResultModel } from '../../../../domain/model/survey-result-model'

export interface LoadSurveyResultRepository {
  loadBySurveyId (surveyId: string): Promise<SurveyResultModel>
}
