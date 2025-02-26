import { completeTestData } from './lib/complete-test-data'
import { FileNotFoundError } from '../file-not-found-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('FileNotFoundError', () => {
  const testData = [
    [undefined, /File not found./],
    [{ fileName : 'foo.txt' }, /File 'foo.txt' not found./],
    [
      { fileName : 'foo.txt', dirPath : '/some/dir' },
      /File '\/some\/dir\/foo.txt' not found./,
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
