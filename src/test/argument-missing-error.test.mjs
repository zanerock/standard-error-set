import { completeTestData } from './lib/complete-test-data'
import { ArgumentMissingError } from '../argument-missing-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('ArgumentInvalidError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /Function argument is missing or empty./],
    [{ packageName : 'my-package', functionName : 'foo' }, /Function 'my-package#foo\(\)' argument is missing or empty./],
    [{ packageName : 'my-package', functionName : 'foo', argumentValue : 'undefined' }, /Function 'my-package#foo\(\)' argument with value 'undefined' is missing or empty./],
    [{ argumentName : 'bar' }, /Function argument 'bar' is missing or empty./],
    [{ issue : 'is undefined' }, /argument is undefined/],
    [{ message : 'Foo is bad', cause : causeError }, /Foo is bad/, causeError],
  ]

  test.each(completeTestData({
    testData,
    defaultStatus : 400,
  }))('Options %p => message %s and status %s', standardErrorTest(ArgumentMissingError))
})
