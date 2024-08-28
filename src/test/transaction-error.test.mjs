import { completeTestData } from './lib/complete-test-data'
import { TransactionError } from '../transaction-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('TransactionError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /There was a transaction error with the remote data service./],
    [
      { service : 'database' },
      /There was a transaction error with the remote database service./,
    ],
    [
      { issue : 'is not responding' },
      /There was a transaction error with the remote data service; service is not responding./,
    ],
    [
      { issue : 'is not responding', service : 'database' },
      /There was a transaction error with the remote database service; service is not responding./,
    ],
    [
      { message : 'Foo is bad', cause : causeError, status : 400 },
      /Foo is bad/,
      400,
      causeError,
    ],
  ]

  test.each(
    completeTestData({
      testData,
      defaultStatus : 500,
    })
  )(
    'Options %p => message %s and status %s',
    standardErrorTest(TransactionError)
  )
})
