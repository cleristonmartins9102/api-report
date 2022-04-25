export type SurveyResultModel = {
  surveyId: string
  question: string
  answers: SurveyResultAnswerModel[]
  create_at: Date
}
interface SurveyResultAnswerModel {
  image?: string
  answer: string
  count: number
  percent: number
}
