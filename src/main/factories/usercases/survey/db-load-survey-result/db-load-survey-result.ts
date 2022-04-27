import { DbLoadSurveyById } from '../../../../../data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { DbLoadSurveyResult } from '../../../../../data/usecases/survey/load-survey-result-by-id/db-load-survey-result'
import { SurveyResultMongoRepository } from '../../../../../infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyResult = (): DbLoadSurveyResult => {
  const loadSurveyResultRepository = new SurveyResultMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  const dbLoadSurveyById = new DbLoadSurveyById(surveyMongoRepository)
  const dbLoadSurveyResult = new DbLoadSurveyResult(loadSurveyResultRepository, dbLoadSurveyById)
  return dbLoadSurveyResult
}
