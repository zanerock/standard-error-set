import { completeTestData } from './lib/complete-test-data'
import { NoAccessError } from '../no-access-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('NoAccessError', () => {
  const testData = [
    [undefined, /Access is denied./]
  ]

  test.each(completeTestData({ 
    testData, defaultStatus: 403
  }))('Options %p => message %s and status %s', standardErrorTest(NoAccessError))
})