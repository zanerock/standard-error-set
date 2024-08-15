import { completeTestData } from './lib/complete-test-data'
import { FileNotFoundError } from '../file-not-found-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('FileNotFoundError', () => {
  const testData = [
    [undefined, /File not found./]
  ]

  test.each(completeTestData({ 
    testData, 
    defaultStatus : 404, 
    defaultCode : 'ENOENT' 
  }))('Options %p => message %s and status %s', standardErrorTest(FileNotFoundError))
})