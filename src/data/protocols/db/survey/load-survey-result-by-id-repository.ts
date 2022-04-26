import { SurveyResultModel } from '../../../../domain/model/survey-result-model'

export interface LoadSurveyResultRepository {
  loadById (surveyId: string): Promise<SurveyResultModel>
}
