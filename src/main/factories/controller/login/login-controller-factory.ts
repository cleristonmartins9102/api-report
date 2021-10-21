import { LoginController } from '../../../../presentation/controller/login/login-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeLoginValidation } from './login-validaton-factory'
import { makeDbAuthentication } from '../../usercases/authentication/db-auhtentication-factory'
import { makeLogControllerDecorator } from '../../decorator/log-signup-controller-decorator'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeLoginValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
