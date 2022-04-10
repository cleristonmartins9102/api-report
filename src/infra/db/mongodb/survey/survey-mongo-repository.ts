import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '../../../../domain/usercases/add-survey'
import { mongoHelper } from '../helper/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const accountCollection = await mongoHelper.getCollection('survey')
    await accountCollection.insertOne(surveyData)
    return Promise.resolve()
  }
}
