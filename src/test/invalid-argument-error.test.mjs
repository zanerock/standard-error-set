import { completeTestData } from './lib/complete-test-data'
import { InvalidArgumentError } from '../invalid-argument-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('InvalidArgumentError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /Function argument has invalid value./, 400],
    [{ status : 401 }, /Function argument has invalid value./, 401, undefined],
    [{ packageName : 'my-package', functionName : 'foo' }, /Function 'my-package#foo\(\)'/, 400],
    [{ functionName : 'foo' }, /Function 'foo\(\)'/],
    [{ functionName : 'foo', argumentName : 'bar' }, /Function 'foo\(\)' argument 'bar'/],
    [
      { functionName : 'foo', argumentName : 'bar', argumentValue : 100 },
      /Function 'foo\(\)' argument 'bar' has invalid value '100'./
    ],
    [{ message : 'Foo is bad', status : 401 }, /Foo is bad/, 401],
    [{ message : 'Foo is bad', cause : causeError }, /Foo is bad/, causeError],
    [{ functionName : 'foo', cause : causeError, status : 401 }, /Function 'foo\(\)'/, 401, causeError],
    [
      { functionName : 'foo', argumentName : 'bar', cause : causeError, status : 401 },
      /Function 'foo\(\)' argument 'bar'/,
      401,
      causeError
    ],
    [
      { functionName : 'foo', argumentName : 'bar', argumentValue : 100, cause : causeError, status : 401 },
      /Function 'foo\(\)' argument 'bar' has invalid value '100'./,
      401,
      causeError
    ],
    [
      { functionName : 'foo', argumentName : 'bar', argumentValue : 100, cause : causeError, status : 401 },
      /Function 'foo\(\)' argument 'bar' has invalid value '100'./,
      401,
      causeError
    ],
    [
      { packageName : 'my-package', functionName : 'foo', argumentName : 'bar', argumentValue : 100, cause : causeError, status : 401 },
      /Function 'my-package#foo\(\)' argument 'bar' has invalid value '100'./,
      401,
      causeError
    ],
    [{ packageName : 'my-package' }, /Function in package 'my-package' argument has invalid value./, 400, undefined],
    [
      { packageName : 'my-package', functionName : 'foo', argumentName : 'bar', bar : 100 },
      /Function 'my-package#foo\(\)' argument 'bar' has invalid value./
    ]
  ]

  test.each(completeTestData({ 
    testData, 
    defaultStatus: 400 
  }))('Options %p => message %s and status %s', standardErrorTest(InvalidArgumentError))
})
