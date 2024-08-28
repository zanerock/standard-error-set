import { completeTestData } from './lib/complete-test-data'
import { ArgumentMissingError } from '../argument-missing-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('ArgumentMissingError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /Command argument is missing or empty./],
    [{ packageName : 'my-package', endpointName : 'foo' }, /Command 'my-package#foo\(\)' argument is missing or empty./],
    [{ packageName : 'my-package', endpointName : 'foo', argumentValue : 'undefined' }, /Command 'my-package#foo\(\)' argument with value 'undefined' is missing or empty./],
    [{ argumentName : 'bar' }, /Command argument 'bar' is missing or empty./],
    [{ argumentType : 'string' }, /Command argument type 'string' is missing or empty.$/],
    [{ issue : 'is undefined' }, /argument is undefined/],
    [{ endpointType : 'function', argumentName : 'bar' }, /Function argument 'bar'/],
    [{ hint : 'Define it.' }, /is missing or empty. Define it.$/],
    [{ message : 'Foo is bad', cause : causeError }, /Foo is bad/, causeError],
  ]

  test.each(completeTestData({
    testData,
    defaultStatus : 400,
  }))('Options %p => message %s and status %s', standardErrorTest(ArgumentMissingError))
})
