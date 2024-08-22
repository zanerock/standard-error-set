import { completeTestData } from './lib/complete-test-data'
import { LocalTransactionError } from '../local-transaction-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('LocalTransactionError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /There was a transaction error./],
    [{ action: 'updating' }, /There was a transaction error updating the database./ ],
    [{ target: 'customer database'}, /There was a transaction error in the customer database./],
    [{ action: 'updating', target: 'customer database'}, /There was a transaction error updating the customer database./],
    [{ target: 'customer database', issue: 'virtual socket closed' }, /There was a transaction error in the customer database; virtual socket closed./],
    [{ message : 'Foo is bad', cause : causeError, status: 400 }, /Foo is bad/, 400, causeError],
  ]

  test.each(completeTestData({
    testData,
    defaultStatus : 500,
  }))('Options %p => message %s and status %s', standardErrorTest(LocalTransactionError))
})
