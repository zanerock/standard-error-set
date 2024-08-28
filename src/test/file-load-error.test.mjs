import { completeTestData } from './lib/complete-test-data'
import { FileLoadError } from '../file-load-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('FileLoadError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /There was an error loading the file./],
    [{ action : 'reading' }, /There was an error reading the file./],
    [
      { fileName : 'foo.txt' },
      /There was an error loading the file 'foo\.txt'./,
    ],
    [
      { dirPath : '/bar', fileName : 'foo.txt' },
      /There was an error loading the file '\/bar\/foo\.txt'./,
    ],
    [
      { dirPath : '/bar', issue : 'virtual socket closed' },
      /There was an error loading the file in directory '\/bar'; virtual socket closed./,
    ],
    [
      { message : 'Foo is bad', cause : causeError, status : 400 },
      /Foo is bad/,
      400,
      causeError,
    ],
  ]

  test.each(
    completeTestData({
      testData,
      defaultStatus : 500,
    })
  )('Options %p => message %s and status %s', standardErrorTest(FileLoadError))
})
