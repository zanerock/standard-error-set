import { completeTestData } from '../../test/lib/complete-test-data'
import { NoAccessError } from '../no-access-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('NoAccessError', () => {
  const testData = [
    [undefined, /Access to resource is denied./],
    [{ resource : 'the thing' }, /Access to the thing is denied./],
  ]

  test.each(
    completeTestData({
      testData,
      defaultStatus : 403,
    })
  )('Options %p => message %s and status %s', standardErrorTest(NoAccessError))
})
