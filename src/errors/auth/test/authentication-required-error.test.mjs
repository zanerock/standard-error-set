import { completeTestData } from '../../test/lib/complete-test-data'
import { AuthenticationRequiredError } from '../authentication-required-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('AuthenticationRequiredError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /^User requires authentication to invoke action\.$/],
    [
      { action : 'update', endpointType : 'customer database' },
      /^User requires authentication to update customer database\.$/,
    ],
    [{ issue : 'requires 2fa authentication' }, /User requires 2fa authentication to invoke action./],
    [
      { message : 'Foo is bad', cause : causeError, status : 500 },
      /Foo is bad/,
      500,
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
    standardErrorTest(AuthenticationRequiredError)
  )
})
