import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

const makeFakeDataSurvey = (): AddSurveyModel => (
  {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
)

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

describe('DbAddSurvey UserCase', () => {
  test('Should call DbAddSurveyRepositpory with correct values', async () => {
    const addSurveyRepository = makeAddSurveyRepositoryStub()
    const addSurveyRepositorySpy = jest.spyOn(addSurveyRepository, 'add')
    const sut = new DbAddSurvey(addSurveyRepository)
    const data = makeFakeDataSurvey()
    await sut.add(data)
    expect(addSurveyRepositorySpy).toHaveBeenCalledWith(data)
  })
})
