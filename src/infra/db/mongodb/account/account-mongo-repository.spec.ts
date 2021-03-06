import { mongoHelper } from '../helper/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
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

  describe('Add()', () => {
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
  })
  describe('LoadByEmail()', () => {
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
  describe('LoadByToken()', () => {
    test('Should return an account on loadByToken success', async () => {
      const sut = new AccountMongoRepository()
      mongoCollection = await mongoHelper.getCollection('accounts')
      await mongoCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('password')
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = new AccountMongoRepository()
      mongoCollection = await mongoHelper.getCollection('accounts')
      await mongoCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('password')
    })

    test('Should return an account on loadByToken with if user is an admin', async () => {
      const sut = new AccountMongoRepository()
      mongoCollection = await mongoHelper.getCollection('accounts')
      await mongoCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('password')
    })
  })

  describe('UpdateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = new AccountMongoRepository()
      const result: any = await mongoCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'password'
      })
      const fakeAccount = result.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount._id, 'any_token')
      const account = await mongoCollection.findOne({ _id: result.ops[0]._id })
      expect(account.accessToken).toBe('any_token')
    })
  })
})
