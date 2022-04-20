import { Collection, Db, MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/model/account-model'

export const mongoHelper = {
  connection: null as MongoClient,
  uri: null,
  async connect (uri?: string): Promise<any> {
    this.uri = uri
    /* istanbul ignore next */
    this.connection = await MongoClient.connect(uri ?? process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any)
  },

  async close (): Promise<any> {
    await this.connection.close()
    this.connection = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.connection?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.connection.db().collection(name)
  },

  map (data: any): any {
    const { _id, ...dataWithoudId } = data
    return { ...dataWithoudId, id: _id }
  },
  mapCollection (collection: any[]): any[] {
    return collection.map(c => mongoHelper.map(c))
  }
}
