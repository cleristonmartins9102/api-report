import { AccountModel } from '../../../../../domain/model/account-model'
import { AddAccountModel } from '../../../../../domain/usercases/add-account-model'
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { mongoHelper } from '../helper/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await mongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]
    return mongoHelper.map(account)
  }
}
