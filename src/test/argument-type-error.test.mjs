import { completeTestData } from './lib/complete-test-data'
import { ArgumentTypeError } from '../argument-type-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('ArgumentInvalidError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /Command argument is wrong type./],
    [{ packageName : 'my-package', endpointName : 'foo' }, /Command 'my-package#foo\(\)' argument is wrong type.$/],
    [{ packageName : 'my-package', endpointName : 'foo', argumentValue : 'undefined' }, /Command 'my-package#foo\(\)' argument with value 'undefined' is wrong type.$/],
    [{ argumentName : 'bar' }, /Command argument 'bar' is wrong type./],
    [{ expectedType : 'number', receivedType : 'string' }, /Expected type 'number', but received type 'string'.$/],
    [{ expectedType : 'number' }, /Expected type 'number'.$/],
    [{ receivedType : 'string' }, /Received type 'string'.$/],
    [{ issue : 'is incompatible type' }, /argument is incompatible type/],
    [{ endpointType : 'function', argumentName : 'bar' }, /Function argument 'bar'/],
    [{ message : 'Foo is bad', cause : causeError, status : 500 }, /Foo is bad/, 500, causeError],
  ]

  test.each(completeTestData({
    testData,
    defaultStatus : 400,
  }))('Options %p => message %s and status %s', standardErrorTest(ArgumentTypeError))
})
