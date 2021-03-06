import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { DbLoadSurveyById } from '../../../../../data/usecases/survey/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyById } from '../../../../../domain/usercases/survey/load-survey-by-id'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
