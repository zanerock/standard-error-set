import { completeTestData } from './lib/complete-test-data'
import { maskNoAccessErrors } from '../mask-no-access-errors'
import { mapErrorToHttpStatus } from '../map-error-to-http-status'
import { NoAccessDirecotryError } from '../no-access-directory-error'
import { NoAccessError } from '../no-access-error'
import { NoAccessFileError } from '../no-access-file-error'
import { NotFoundError } from '../not-found-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('maskNoAccessErrors', () => {
  beforeAll(() => maskNoAccessErrors())
  afterAll(() => mapErrorToHttpStatus())

  const noAccessTestData = [
    [undefined, /Resource not found./],
    [{ resource : 'the thing' }, /The thing not found./]
  ]

  test.each(completeTestData({
    testData: noAccessTestData,
    defaultStatus : 404,
    defaultCode   : 'ENOENT'
  }))('Options %p => message %s and status %s', standardErrorTest(NoAccessError))

  test.each(noAccessTestData)('NoAccessError and NotFoundError generate the same messages', 
    (options, stringMatcher) => {
      const noAccessError = new NoAccessError(options)
      const notFoundError = new NotFoundError(options)

      expect(notFoundError.message).toBe(notFoundError.message)
    })
})
