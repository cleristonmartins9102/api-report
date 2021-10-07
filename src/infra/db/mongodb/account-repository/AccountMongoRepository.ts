import { AccountModel } from '../../../../../domain/model/account-model'
import { AddAccountModel } from '../../../../../domain/usercases/add-account-model'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { mongoHelper } from '../helper/mongo-helper'
import { Collection } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]
    return mongoHelper.map(account)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection: Collection = await mongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return mongoHelper.map(account)
  }
}
