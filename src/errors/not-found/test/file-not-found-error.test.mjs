import { completeTestData } from '../../test/lib/complete-test-data'
import { FileNotFoundError } from '../file-not-found-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('FileNotFoundError', () => {
  const cause = new Error()

  const testData = [
    [undefined, /File not found./],
    [{ fileName : 'foo.txt' }, /File 'foo.txt' not found./],
    [
      { fileName : 'foo.txt', dirPath : '/some/dir' },
      /File '\/some\/dir\/foo.txt' not found./,
    ],
    [
      { message : 'Foo is bad', cause : cause, status : 400 },
      /Foo is bad/,
      400,
      cause,
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
    standardErrorTest(FileNotFoundError)
  )
})
