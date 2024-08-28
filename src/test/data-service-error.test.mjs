import { completeTestData } from './lib/complete-test-data'
import { DataServiceError } from '../data-service-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('DataServiceError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /There was an error with the remote data service./],
    [
      { service: 'database' },
      /There was an error with the remote database service./,
    ],
    [
      { issue: 'is not responding' },
      /There was an error with the remote data service; service is not responding./,
    ],
    [
      { service: 'database', issue: 'is not responding' },
      /There was an error with the remote database service; service is not responding./,
    ],
    [
      { message: 'Foo is bad', cause: causeError, status: 400 },
      /Foo is bad/,
      400,
      causeError,
    ],
  ]

  test.each(
    completeTestData({
      testData,
      defaultStatus: 500,
    })
  )(
    'Options %p => message %s and status %s',
    standardErrorTest(DataServiceError)
  )
})
