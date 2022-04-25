import { SaveSurveyResultRepository } from '../../../../data/protocols/db/survey'
import { SurveyResultModel } from '../../../../domain/model/survey-result-model'
import { SaveSurveyResultModel } from '../../../../domain/usercases/save-survey-result'
import { mongoHelper } from '../helper/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const resultCollection = await mongoHelper.getCollection('result')
    await resultCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        create_at: data.create_at
      }
    }, {
      upsert: true
    })
    return await this.loadSurveyById(data.surveyId)
  }

  private async loadSurveyById (survey: string): Promise<SurveyResultModel> {
    const resultCollection = await mongoHelper.getCollection('result')
    const query = resultCollection.aggregate([
      {
        $match: {
          surveyId: new ObjectId(survey)
        }
      },
      {
        $group: {
          _id: 0,
          data: {
            $push: '$$ROOT'
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $unwind: {
          path: '$data'
        }
      },
      {
        $lookup: {
          from: 'survey',
          foreignField: '_id',
          localField: 'data.surveyId',
          as: 'survey'
        }
      },
      {
        $unwind: {
          path: '$survey'
        }
      },
      {
        $group: {
          _id: {
            surveyId: '$survey._id',
            question: '$survey.question',
            date: '$survey.created_at',
            total: '$count',
            answer: {
              $filter: {
                input: '$survey.answers',
                as: 'items',
                cond: {
                  $eq: ['$$items.answer', '$data.answer']
                }
              }
            }
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $unwind: {
          path: '$_id.answer'
        }
      },
      {
        $addFields: {
          '_id.answer.count': '$count',
          '_id.answer.percent': {
            $multiply: [
              {
                $divide: ['$count', '$_id.total']
              }, 100
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            surveyId: '$_id.surveyId',
            question: '$_id.question',
            date: '$_id.date'
          },
          answers: {
            $push: '$_id.answer'
          }
        }
      },
      {
        $project: {
          _id: 0,
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: '$answers'
        }
      }
    ])
    const result = await query.toArray()
    return result?.length ? result[0] : null
  }
}
