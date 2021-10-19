import { LoginController } from '../../../presentation/controller/login/login-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorator/log-controller-decorator'
import { makeLoginValidation } from './login-validaton-factory'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/jwt-adapter/jwt-adapter'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const validator = makeLoginValidation()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter('any_secret')
  const accountMongoRepository = new AccountMongoRepository()
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(validator, authentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
