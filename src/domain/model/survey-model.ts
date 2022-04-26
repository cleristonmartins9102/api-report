export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  create_at: any
}

export interface SurveyAnswerModel {
  image: string
  answer: string
}
