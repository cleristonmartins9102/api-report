import { DbLoadSurvey } from '../../../../../data/usecases/survey/load-survey/db-load-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurvey } from '../../../../../domain/usercases/load-survey'

export const makeDbLoadSurvey = (): LoadSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurvey(surveyMongoRepository)
}
