import { completeTestData } from '../../test/lib/complete-test-data'
import { AuthorizationConditionsNotMetError } from '../authorization-conditions-not-met-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('AuthorizationConditionsNotMetError', () => {
  const preamble = 'While generally authorized'
  const stdIssue = ', current conditions prevent this action.'
  const cause = new Error()

  const testData = [
    [undefined, new RegExp(`${preamble}${stdIssue}`)],
    [
      { action : 'access the database' },
      new RegExp(`${preamble} to access the database${stdIssue}`),
    ],
    [
      { issue : 'user is over rate quota' },
      new RegExp(`${preamble}, user is over rate quota.`),
    ],
    [
      { action : 'access the database', issue : 'user is over quota' },
      new RegExp(`${preamble} to access the database, user is over quota.`),
    ],
    [{ hint : 'Try again later.' }, /. Try again later.$/],
    [{ message : 'Foo is bad', cause, status : 500 }, /Foo is bad/, 500, cause],
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
