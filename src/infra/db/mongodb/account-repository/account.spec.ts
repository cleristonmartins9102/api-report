import { mongoHelper } from '../helper/mongo-helper'
import { AccountMongoRepository } from './AccountMongoRepository'
import { Collection } from 'mongodb'

let mongoCollection: Collection
describe('Account MongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.close()
  })

  beforeEach(async () => {
    mongoCollection = await mongoHelper.getCollection('accounts')
    await mongoCollection.deleteMany({})
  })

  test('Shoud return an account on add success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email')
    expect(account.password).toBe('password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = new AccountMongoRepository()
    mongoCollection = await mongoHelper.getCollection('accounts')
    await mongoCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'password'
    })
    const account = await sut.loadByEmail('any_email@email.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('password')
  })

  test('Should return null loadByEmail fail', async () => {
    const sut = new AccountMongoRepository()
    mongoCollection = await mongoHelper.getCollection('accounts')
    const account = await sut.loadByEmail('any_email@email.com')
    expect(account).toBeNull()
  })
})
