import { completeTestData } from '../../test/lib/complete-test-data'
import { ExternalServiceError } from '../external-service-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('ExternalServiceError', () => {
  const cause = new Error()

  const testData = [
    [undefined, /^There was an error with the remote service\.$/],
    [
      { service : 'Foo API' },
      /^There was an error with the remote Foo API service.$/,
    ],
    [{ issue : 'is not responding' }, /^The remote service is not responding\./],
    [
      { service : 'Foo API', issue : 'is not responding' },
      /^The remote Foo API service is not responding\./,
    ],
    [{ message : 'Foo is bad', cause, status : 400 }, /Foo is bad/, 400, cause],
  ]

  test.each(
    completeTestData({
      testData,
      defaultStatus : 500,
    })
  )(
    'Options %p => message %s and status %s',
    standardErrorTest(ExternalServiceError)
  )
})
