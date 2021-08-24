import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
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
    const controllerStub = new ControllerStub()
    const stubSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
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
})
