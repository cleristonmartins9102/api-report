import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { LoadAccountByToken } from '../../../../../domain/usercases/load-account-by-token'
import { DbLoadAccountByToken } from '../../../../../data/usecases/account/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../../../../infra/jwt-adapter/jwt-adapter'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const accountMongoRepository = new AccountMongoRepository()
  const decrypter = new JwtAdapter('any_secret')
  return new DbLoadAccountByToken(decrypter, accountMongoRepository)
}
