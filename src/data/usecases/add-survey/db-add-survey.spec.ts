import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

type SutType = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

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

const makeSut = (): SutType => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey UserCase', () => {
  test('Should call DbAddSurveyRepositpory with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSurveyRepositorySpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const data = makeFakeDataSurvey()
    await sut.add(data)
    expect(addSurveyRepositorySpy).toHaveBeenCalledWith(data)
  })
})
