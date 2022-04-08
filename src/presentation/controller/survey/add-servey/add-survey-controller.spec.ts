import { AddSurveyController } from './add-survey-controller'
import { HttpRequest } from './add-survey-controller-protocols'
import { Validation } from '../../../protocols/validations'
import { Controller } from '../../../protocols/controller'

type SutType = {
  sut: Controller
  validationStub: Validation
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

const makeSut = (): SutType => {
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
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
})
