import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, AddSurvey } from './add-survey-controller-protocols'
import { Validation } from '../../../protocols/validations'
import { Controller } from '../../../protocols/controller'
import { badRequest } from '../../../helpers/http/http-helpers'

type SutType = {
  sut: Controller
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeHttpRequest = (): HttpRequest => (
  {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  }
)

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddSurveyStub = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: any): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

const makeSut = (): SutType => {
  const validationStub = makeValidationStub()
  const addSurveyStub = makeAddSurveyStub()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validationStubSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(validationStubSpy).toBeCalledWith(httpRequest.body)
  })

  test('Ensure Validation returns 400 if fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = makeHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSurveyStubSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(addSurveyStubSpy).toBeCalledWith(httpRequest.body)
  })
})
