import { Db, MongoClient } from 'mongodb'

export class MongoHelper {
  private connection: MongoClient
  private db: Db

  async connect (): Promise<any> {
    this.connection = await MongoClient.connect(process.env.MONGO_URL as any)
    this.db = await this.connection.db()
  }

  async close (): Promise<any> {
    await this.connection.close()
  }
}
