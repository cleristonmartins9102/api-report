import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(
        {
          statusCode: 200,
          body: {
            name: 'cleriston'
          }
        }
      ))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepository()
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const stubSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = {
      body: {
        email: 'anyemail@gmail.com',
        name: 'Cleriston',
        password: 'anypasswd',
        confirmPasswd: 'anypasswd'
      }
    }
    await sut.handle(httpRequest)
    expect(stubSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, controllerStub } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'anyemail@gmail.com',
        name: 'Cleriston',
        password: 'anypasswd',
        confirmPasswd: 'anypasswd'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual({
      statusCode: 200,
      body: {
        name: 'cleriston'
      }
    })
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const error = new Error()
    error.stack = 'any_stack'
    const fakeError = {
      statusCode: 500,
      body: error
    }
    const stubSpy = jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(fakeError)))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    const httpRequest: HttpRequest = {
      body: {
        email: 'anyemail@gmail.com',
        name: 'Cleriston',
        password: 'anypasswd',
        confirmPasswd: 'anypasswd'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
