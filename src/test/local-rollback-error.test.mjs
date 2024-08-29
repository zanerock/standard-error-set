import { completeTestData } from './lib/complete-test-data'
import { LocalRollbackError } from '../local-rollback-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('LocalRollbackError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /There was a rollback error./],
    [
      { action : 'updating' },
      /There was a rollback error updating the database./,
    ],
    [
      { target : 'customer database' },
      /There was a rollback error in the customer database./,
    ],
    [
      { action : 'updating', target : 'customer database' },
      /There was a rollback error updating the customer database./,
    ],
    [
      { target : 'customer database', issue : 'virtual socket closed' },
      /There was a rollback error in the customer database; virtual socket closed./,
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
    standardErrorTest(LocalRollbackError)
  )
})
