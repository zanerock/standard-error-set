import { completeTestData } from '../../test/lib/complete-test-data'
import { RollbackError } from '../rollback-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('RollbackError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /There was a rollback error in the remote database\.$/],
    [
      { action : 'updating' },
      /There was a rollback error updating the remote database\.$/,
    ],
    [
      { target : 'customer database' },
      /There was a rollback error in the remote customer database\.$/,
    ],
    [
      { action : 'updating', target : 'customer database' },
      /There was a rollback error updating the remote customer database\.$/,
    ],
    [
      { target : 'customer database', issue : 'virtual socket closed' },
      /There was a rollback error in the remote customer database; virtual socket closed\.$/,
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
  )('Options %p => message %s and status %s', standardErrorTest(RollbackError))
})
