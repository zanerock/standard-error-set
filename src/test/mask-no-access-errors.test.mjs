import { completeTestData } from './lib/complete-test-data'
import { DirectoryNotFoundError } from '../directory-not-found-error'
import { FileNotFoundError } from '../file-not-found-error'
import { maskNoAccessErrors } from '../mask-no-access-errors'
import { mapErrorToHttpStatus } from '../map-error-to-http-status'
import { NoAccessDirectoryError } from '../no-access-directory-error'
import { NoAccessError } from '../no-access-error'
import { NoAccessFileError } from '../no-access-file-error'
import { NotFoundError } from '../not-found-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('maskNoAccessErrors', () => {
  beforeAll(() => maskNoAccessErrors())
  afterAll(() => mapErrorToHttpStatus())

  describe('NoAccessError', () => {
    const testData = [
      [undefined, /Resource not found./],
      [{ resource : 'the thing' }, /The thing not found./],
    ]

    test.each(
      completeTestData({
        testData,
        defaultStatus : 404,
        defaultCode   : 'ENOENT',
      })
    )(
      'Options %p => message %s and status %s',
      standardErrorTest(NoAccessError)
    )

    test.each(testData)(
      'NoAccessError and NotFoundError generate the same messages',
      (options) => {
        const noAccessError = new NoAccessError(options)
        const notFoundError = new NotFoundError(options)

        expect(noAccessError.message).toBe(notFoundError.message)
      }
    )
  })

  describe('NoAccessFileError', () => {
    const testData = [
      [undefined, /File not found./],
      [{ fileName : 'foo.txt' }, /File 'foo.txt' not found./],
      [
        { dirPath : '/dir', fileName : 'foo.txt' },
        /File '\/dir\/foo.txt' not found./,
      ],
    ]

    test.each(
      completeTestData({
        testData,
        defaultStatus : 404,
        defaultCode   : 'ENOENT',
      })
    )(
      'Options %p => message %s and status %s',
      standardErrorTest(NoAccessFileError)
    )

    test.each(testData)(
      'NoAccessFileError and FileNotFoundError generate the same messages',
      (options) => {
        const noAccessFileError = new NoAccessFileError(options)
        const fileNotFoundError = new FileNotFoundError(options)

        expect(noAccessFileError.message).toBe(fileNotFoundError.message)
      }
    )
  })

  describe('NoAccessDirecotryError', () => {
    const testData = [
      [undefined, /Directory not found./],
      [{ dirPath : '/dir' }, /Directory '\/dir' not found./],
    ]

    test.each(
      completeTestData({
        testData,
        defaultStatus : 404,
        defaultCode   : 'ENOENT',
      })
    )(
      'Options %p => message %s and status %s',
      standardErrorTest(NoAccessDirectoryError)
    )

    test.each(testData)(
      'NoAccessDirectoryError and DirectoryNotFoundError generate the same messages',
      (options) => {
        const noAccessDirectoryError = new NoAccessDirectoryError(options)
        const directoryNotFoundError = new DirectoryNotFoundError(options)

        expect(noAccessDirectoryError.message).toBe(
          directoryNotFoundError.message
        )
      }
    )
  })
})
