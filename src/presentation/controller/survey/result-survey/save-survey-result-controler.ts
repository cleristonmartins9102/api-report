import { Controller, HttpRequest, HttpResponse } from './save-survey-controller-protocols'
import { LoadSurveyResultById } from '../../../../domain/usercases/load-survey-result-by-id'
import { forbidden, ok, serverError } from '../../../helpers/http/http-helpers'
import { InvalidParamError } from '../../../erros'
import { SaveSurveyResult } from '../../../../domain/usercases/save-survey-result'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyResult: LoadSurveyResultById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyResult.loadById(httpRequest.params.surveyId)
      if (survey) {
        const { answer } = httpRequest.body
        const { surveyId } = httpRequest.params
        const { accountId } = httpRequest.header
        const ansFind = survey.answers.filter(a => a.answer === answer)
        if (ansFind.length === 0) {
          return forbidden(new InvalidParamError('answer'))
        }
        await this.saveSurveyResult.save({
          accountId,
          surveyId,
          answer,
          create_at: new Date()
        })
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return ok('')
    } catch (error) {
      return serverError(error)
    }
  }
}
