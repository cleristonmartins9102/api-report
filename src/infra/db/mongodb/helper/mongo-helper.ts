import { Collection, Db, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../../domain/model/account-model'

export const mongoHelper = {
  connection: MongoClient,
  db: Db,

  async connect (): Promise<any> {
    this.connection = await MongoClient.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any)
    this.db = await this.connection.db()
  },

  async close (): Promise<any> {
    await this.connection.close()
  },

  getCollection (name: string): Collection {
    return this.connection.db().collection(name)
  },
  map (account: any): AccountModel {
    const { _id, ...accountWithoudId } = account
    return { ...accountWithoudId, id: _id }
  }
}
