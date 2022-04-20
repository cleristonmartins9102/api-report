import { SaveSurveyResultRepository } from '../../../../data/protocols/db/survey'
import { SurveyResultModel } from '../../../../domain/model/survey-result-model'
import { SaveSurveyResultModel } from '../../../../domain/usercases/save-survey-result'
import { mongoHelper } from '../helper/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const resultCollection = await mongoHelper.getCollection('result')
    const res = await resultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        data: data.create_at
      }
    }, {
      upsert: true,
      returnOriginal: false
    })
    return res.value && mongoHelper.map(res.value)
  }
}
