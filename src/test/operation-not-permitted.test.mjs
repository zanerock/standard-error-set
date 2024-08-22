import { completeTestData } from './lib/complete-test-data'
import { OperationNotPermittedError } from '../operation-not-permitted-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('OperationNotPermittedError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /Action is not permitted./],
    [{ action : 'database update' }, /Database update is not permitted./],
    [{ target : 'customer database' }, /Accessing the customer database is not permitted./],
    [{ action : 'updating', target : 'customer database' }, /Updating the customer database is not permitted./],
    [{ issue : 'is not authorized' }, /Action is not authorized./],
    [{ message : 'Foo is bad', cause : causeError, status : 400 }, /Foo is bad/, 400, causeError],
  ]

  test.each(completeTestData({
    testData,
    defaultStatus : 403,
  }))('Options %p => message %s and status %s', standardErrorTest(OperationNotPermittedError))
})
