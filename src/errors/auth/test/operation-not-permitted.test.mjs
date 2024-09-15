import { completeTestData } from '../../test/lib/complete-test-data'
import { OperationNotPermittedError } from '../operation-not-permitted-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('OperationNotPermittedError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /^User is not permitted to invoke action.$/],
    [{ action : 'update', endpointType : 'database' }, /^User is not permitted to update database\.$/],
    [
      { action: 'access', endpointType : 'database', endpointName : 'customer' },
      /^User is not permitted to access database 'customer'\.$/,
    ],
    [
      { issue : 'is not authorized' },
      /^User is not authorized to invoke action\.$/,
    ],
    [
      { message : 'Foo is bad', cause : causeError, status : 400 },
      /^Foo is bad$/,
      400,
      causeError,
    ],
  ]

  test.each(
    completeTestData({
      testData,
      defaultStatus : 403,
    })
  )(
    'Options %p => message %s and status %s',
    standardErrorTest(OperationNotPermittedError)
  )
})
