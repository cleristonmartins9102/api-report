import { SignUpController } from '../../../../presentation/controller/login/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validaton-factory'
import { makeDbAuthentication } from '../../usercases/account/authentication/db-auhtentication-factory'
import { makeDbAddAccount } from '../../usercases/account/db-add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decorator/log-signup-controller-decorator'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
