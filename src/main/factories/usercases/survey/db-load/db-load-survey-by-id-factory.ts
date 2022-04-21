import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { DbLoadSurveyResultById } from '../../../../../data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyResultById } from '../../../../../domain/usercases/load-survey-result-by-id'

export const makeDbLoadSurveyById = (): LoadSurveyResultById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResultById(surveyMongoRepository)
}
