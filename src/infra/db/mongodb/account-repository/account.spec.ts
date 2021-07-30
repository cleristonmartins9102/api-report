import { MongoClient } from 'mongodb'
import { mongoHelper } from '../helper/mongo-helper'
import { AccountMongoRepository } from './AccountMongoRepository'

describe('Account MongoRepository', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.close()
  })

  test('Shoud return an account on success', async () => {
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
