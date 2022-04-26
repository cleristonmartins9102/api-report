import { AddSurveyRepository, LoadSurveyRepository } from '../../../../data/protocols/db/survey'
import { SurveyModel } from '../../../../domain/model/survey-model'
import { AddSurveyModel } from '../../../../domain/usercases/add-survey'
import { mongoHelper } from '../helper/mongo-helper'
import { ObjectId } from 'mongodb'
import { LoadSurveyByIdRepository } from '../../../../data/protocols/db/survey/load-survey-by-id-repository'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const accountCollection = await mongoHelper.getCollection('survey')
    await accountCollection.insertOne(surveyData)
    return Promise.resolve()
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await mongoHelper.getCollection('survey')
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()
    return surveys && mongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const accountCollection = await mongoHelper.getCollection('survey')
    const survey = await accountCollection.findOne({
      _id: new ObjectId(id)
    })
    return survey && mongoHelper.map(survey)
  }
}
