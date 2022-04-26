import { Controller, HttpRequest, HttpResponse } from './save-survey-controller-protocols'
import { LoadSurveyById } from '../../../../domain/usercases/survey/load-survey-by-id'
import { forbidden, ok, serverError } from '../../../helpers/http/http-helpers'
import { InvalidParamError } from '../../../erros'
import { SaveSurveyResult } from '../../../../domain/usercases/survey-result/save-survey-result'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { answer } = httpRequest.body
      const { surveyId } = httpRequest.params
      const { accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const ansFind = survey.answers.filter(a => a.answer === answer)
        if (ansFind.length === 0) {
          return forbidden(new InvalidParamError('answer'))
        }
        const result = await this.saveSurveyResult.save({
          accountId: accountId,
          surveyId,
          answer,
          create_at: new Date()
        })
        return ok(result)
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
