import { completeTestData } from './lib/complete-test-data'
import { ArgumentInvalidError } from '../argument-invalid-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('ArgumentInvalidError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /Function argument is invalid./, 400],
    [{ status : 401 }, /Function argument is invalid./, 401, undefined],
    [{ packageName : 'my-package', functionName : 'foo' }, /Function 'my-package#foo\(\)'/, 400],
    [{ functionName : 'foo' }, /Function 'foo\(\)'/],
    [{ functionName : 'foo', argumentName : 'bar' }, /Function 'foo\(\)' argument 'bar' is invalid/],
    [
      { functionName : 'foo', argumentName : 'bar', argumentValue : 100 },
      /Function 'foo\(\)' argument 'bar' with value '100' is invalid./
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
      /Function 'foo\(\)' argument 'bar' with value '100' is invalid./,
      401,
      causeError
    ],
    [
      { functionName : 'foo', argumentName : 'bar', argumentValue : 100, cause : causeError, status : 401 },
      /Function 'foo\(\)' argument 'bar' with value '100' is invalid./,
      401,
      causeError
    ],
    [
      { packageName : 'my-package', functionName : 'foo', argumentName : 'bar', argumentValue : 100, cause : causeError, status : 401 },
      /Function 'my-package#foo\(\)' argument 'bar' with value '100' is invalid./,
      401,
      causeError
    ],
    [{ packageName : 'my-package' }, /Function in package 'my-package' argument is invalid./, 400, undefined],
    [
      { packageName : 'my-package', functionName : 'foo', argumentName : 'bar', bar : 100 },
      /Function 'my-package#foo\(\)' argument 'bar' is invalid./
    ]
  ]

  test.each(completeTestData({
    testData,
    defaultStatus : 400
  }))('Options %p => message %s and status %s', standardErrorTest(ArgumentInvalidError))
})
