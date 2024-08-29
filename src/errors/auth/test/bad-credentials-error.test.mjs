import { completeTestData } from '../../test/lib/complete-test-data'
import { BadCredentialsError } from '../bad-credentials-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('BadCredentialsError', () => {
  const cause = new Error()

  const testData = [
    [undefined, /^Authentication failed.$/],
    [{ method : 'password' }, /Authentication of password failed./],
    [
      { action : 'decoding', method : 'SSL cert' },
      /Decoding of SSL cert failed./,
    ],
    [
      { issue : 'certificate not signed' },
      /^Authentication failed; certificate not signed.$/,
    ],
    [{ hint : 'Try again later.' }, /. Try again later.$/],
    [{ message : 'Foo is bad', cause, status : 500 }, /Foo is bad/, 500, cause],
  ]

  test.each(
    completeTestData({
      testData,
      defaultStatus : 400,
    })
  )(
    'Options %p => message %s and status %s',
    standardErrorTest(BadCredentialsError)
  )
})
