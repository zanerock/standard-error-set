import { completeTestData } from './lib/complete-test-data'
import { ArgumentOutOfRangeError } from '../argument-out-of-range-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('ArgumentOutOfRangeError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /Command argument is out of range./, 400],
    [{ status : 401 }, /Command argument is out of range./, 401, undefined],
    [{ packageName : 'my-package', endpointName : 'foo' }, /Command 'my-package#foo\(\)'/, 400],
    [{ endpointName : 'foo' }, /Command 'foo\(\)'/],
    [{ endpointName : 'foo', argumentName : 'bar' }, /Command 'foo\(\)' argument 'bar' is out of range./],
    [
      { endpointName : 'foo', argumentName : 'bar', argumentValue : 100 },
      /Command 'foo\(\)' argument 'bar' with value '100' is out of range./,
    ],
    [{ message : 'Foo is bad', cause : causeError }, /Foo is bad/, causeError],
    [
      { argumentName : 'bar', argumentValue : 5, max : 4 },
      /argument 'bar' with value '5' is out of range. Value must be less than or equal to '4'./,
    ],
    [
      { argumentName : 'bar', argumentValue : 5, max : 4, minBoundary : 1 },
      /argument 'bar' with value '5' is out of range. Value must be greater than '1' and less than or equal to '4'./,
    ],
    [
      { argumentName : 'bar', argumentValue : 5, min : 10 },
      /argument 'bar' with value '5' is out of range. Value must be greater than or equal to '10'./,
    ],
    [{ maxBoundary : 12 }, /must be less than '12'/],
    [{ endpointType : 'function', argumentName : 'bar' }, /Function argument 'bar'/],
  ]

  test.each(completeTestData({
    testData,
    defaultStatus : 400,
  }))('Options %p => message %s and status %s', standardErrorTest(ArgumentOutOfRangeError))
})
