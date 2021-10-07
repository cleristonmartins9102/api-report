import { SignUpController } from '../../presentation/controller/signup/signUpController'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/AccountMongoRepository'
import { LogControllerDecorator } from '../decorator/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log'
import { Controller } from '../../presentation/protocols'
import { makeSignUpValidation } from './signup-validators'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter/bcrypt-adapter'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const controller = new SignUpController(dbAddAccount, makeSignUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
