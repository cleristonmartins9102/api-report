import { SaveSurveyResult } from '../../../../../domain/usercases/save-survey-result'
import { DbSaveSurveyResult } from '../../../../../data/usecases/survey/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '../../../../../infra/db/mongodb/survey-save-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository)
}
