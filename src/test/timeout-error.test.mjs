import { completeTestData } from './lib/complete-test-data'
import { TimeoutError } from '../timeout-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('TimeoutError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /The process has timed out./],
    [{ resource: 'user session' }, /The user session has timed out./],
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
  )('Options %p => message %s and status %s', standardErrorTest(TimeoutError))
})
