import { completeTestData } from '../../test/lib/complete-test-data'
import { AuthorizationConditionsNotMetError } from '../authorization-conditions-not-met-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('AuthorizationConditionsNotMetError', () => {
  const preamble = 'User request is authorized but'
  const stdIssue = 'does not meet necessary conditions'
  const cause = new Error()

  const testData = [
    [undefined, new RegExp(`^${preamble} ${stdIssue} to invoke action\\.$`)],
    [
      { action : 'access', endpointType: 'database', endpointName: 'customer' },
      new RegExp(`${preamble} ${stdIssue} to access database 'customer'\\.$`),
    ],
    [
      { issue : 'user is over rate quota' },
      new RegExp(`^${preamble} user is over rate quota to invoke action\\.$`),
    ],
    [{ hint : 'Try again later.' }, /\. Try again later\.$/],
    [{ message : 'Foo is bad', cause, status : 500 }, /^Foo is bad$/, 500, cause],
  ]

  test.each(
    completeTestData({
      testData,
      defaultStatus : 403,
    })
  )(
    'Options %p => message %s and status %s',
    standardErrorTest(AuthorizationConditionsNotMetError)
  )
})
