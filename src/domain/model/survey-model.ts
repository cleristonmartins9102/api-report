export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  created_at: any
}

export interface SurveyAnswerModel {
  image: string
  answer: string
}
