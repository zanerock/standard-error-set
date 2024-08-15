import { completeTestData } from './lib/complete-test-data'
import { hideNoAccessErrors } from '../hide-no-access-errors'
import { mapErrorToHttpStatus } from '../map-error-to-http-status'
import { NoAccessError } from '../no-access-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('hideNoAccessErrors', () => {
  beforeAll(() => hideNoAccessErrors())
  afterAll(() => mapErrorToHttpStatus())

  const testData = [
    [undefined, /Resource not found./]
  ]

  test.each(completeTestData({ 
    testData, 
    defaultStatus: 404, 
    defaultCode: 'ENOENT' 
  }))('Options %p => message %s and status %s', standardErrorTest(NoAccessError))
})