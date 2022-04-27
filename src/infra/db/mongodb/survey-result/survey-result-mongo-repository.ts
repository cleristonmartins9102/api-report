import { SaveSurveyResultRepository } from '../../../../data/protocols/db/survey'
import { SurveyResultModel } from '../../../../domain/model/survey-result-model'
import { SaveSurveyResultModel } from '../../../../domain/usercases/survey-result/save-survey-result'
import { mongoHelper } from '../helper/mongo-helper'
import { ObjectId } from 'mongodb'
import { QueryBuilder } from '../helper/query-builder'
import { LoadSurveyResultRepository } from '../../../../data/protocols/db/survey/load-survey-result-repository'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
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
    return await this.loadBySurveyId(data.surveyId)
  }

  async loadBySurveyId (survey: string): Promise<SurveyResultModel> {
    const resultCollection = await mongoHelper.getCollection('result')
    const builder = (new QueryBuilder())
      .match({ surveyId: new ObjectId(survey) })
      .group(
        {
          _id: 0,
          data: {
            $push: '$$ROOT'
          },
          count: {
            $sum: 1
          }
        })
      .unwind({
        path: '$data'
      })
      .group({
        _id: {
          surveyId: '$data.surveyId',
          answer: '$data.answer',
          total: '$total'
        },
        count: {
          $sum: 1
        }
      })
      .lookup({
        from: 'survey',
        localField: '_id.surveyId',
        foreignField: '_id',
        as: 'survey'

      })
      .unwind({
        path: '$survey'
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        create_at: '$survey.created_at',
        question: '$survey.question',
        answer: '$_id.answer',
        answers: {
          $map: {
            input: '$survey.answers',
            as: 'answer',
            in: {
              $mergeObjects: [
                '$$answer', {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$_id.answer', '$$answer.answer']
                      },
                      then: {
                        $sum: '$count'
                      },
                      else: 0
                    }
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$_id.answer', '$$answer.answer']
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ['$count', '$_id.total']
                          }, 100
                        ]
                      },
                      else: 0
                    }
                  }
                }
              ]
            }
          }
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          create_at: '$create_at',
          total: '$total'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        create_at: '$_id.create_at',
        question: '$_id.question',
        total: '$_id.total',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .unwind({
        path: '$answers'
      })
      .group({
        _id: {
          create_at: '$create_at',
          surveyId: '$surveyId',
          question: '$question',
          answer: '$answers.answer',
          image: '$answers.image'

        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        }
      })
      .sort({
        count: -1
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        create_at: '$_id.create_at',
        question: '$_id.question',
        answers: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: '$count',
          percent: '$percent'

        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          create_at: '$create_at'
        },
        answers: {
          $push: {
            answer: '$answers.answer',
            image: '$answers.image',
            count: '$answers.count',
            percent: '$answers.percent'
          }
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        create_at: '$_id.create_at',
        question: '$_id.question',
        answers: '$answers'
      })
      .build()

    const result = await resultCollection.aggregate(builder).toArray()
    return result?.length ? result[0] : null
  }
}
