import { completeTestData } from '../../test/lib/complete-test-data'
import { ArgumentInvalidError } from '../argument-invalid-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('ArgumentInvalidError', () => {
  const causeError = new Error()
  const circularArgument = { a : {} }
  circularArgument.a.a = circularArgument.a

  const testData = [
    [undefined, /Command argument is invalid./, 400],
    [{ status : 401 }, /Command argument is invalid./, 401, undefined],
    [
      { packageName : 'my-package', endpointName : 'foo()' },
      /Command 'my-package#foo\(\)'/,
      400,
    ],
    [{ endpointName : 'foo()' }, /Command 'foo\(\)'/],
    [
      { endpointName : 'foo()', argumentName : 'bar' },
      /Command 'foo\(\)' argument 'bar' is invalid/,
    ],
    [
      { endpointName : 'foo()', argumentName : 'bar', argumentValue : 100 },
      /Command 'foo\(\)' argument 'bar' with value '100' is invalid./,
    ],
    [{ argumentType : 'string' }, /Command argument type 'string' is invalid./],
    [{ hint : 'Try again.' }, /is invalid. Try again.$/],
    [{ argumentValue : [1, 2] }, /with value '\[1,2\]/],
    [{ message : 'Foo is bad', status : 401 }, /Foo is bad/, 401],
    [{ message : 'Foo is bad', cause : causeError }, /Foo is bad/, causeError],
    [
      { endpointName : 'foo()', cause : causeError, status : 401 },
      /Command 'foo\(\)'/,
      401,
      causeError,
    ],
    [
      {
        endpointName : 'foo()',
        argumentName : 'bar',
        cause        : causeError,
        status       : 401,
      },
      /Command 'foo\(\)' argument 'bar'/,
      401,
      causeError,
    ],
    [
      {
        endpointName  : 'foo()',
        argumentName  : 'bar',
        argumentValue : 100,
        cause         : causeError,
        status        : 401,
      },
      /Command 'foo\(\)' argument 'bar' with value '100' is invalid./,
      401,
      causeError,
    ],
    [
      {
        endpointName  : 'foo()',
        argumentName  : 'bar',
        argumentValue : 100,
        cause         : causeError,
        status        : 401,
      },
      /Command 'foo\(\)' argument 'bar' with value '100' is invalid./,
      401,
      causeError,
    ],
    [
      {
        packageName   : 'my-package',
        endpointName  : 'foo()',
        argumentName  : 'bar',
        argumentValue : 100,
        cause         : causeError,
        status        : 401,
      },
      /Command 'my-package#foo\(\)' argument 'bar' with value '100' is invalid./,
      401,
      causeError,
    ],
    [
      { packageName : 'my-package' },
      /Command in package 'my-package' argument is invalid./,
      400,
      undefined,
    ],
    [
      {
        packageName  : 'my-package',
        endpointName : 'foo()',
        argumentName : 'bar',
        bar          : 100,
      },
      /Command 'my-package#foo\(\)' argument 'bar' is invalid./,
    ],
    [
      { endpointType : 'function', argumentName : 'bar' },
      /^Function argument 'bar' is invalid.$/,
    ],
    [
      { endpointType : 'function', argumentName : 'bar', issue : 'is bad' },
      /^Function argument 'bar' is bad.$/,
    ],
    [{ argumentValue : circularArgument }, /value '\[object Object\]'/], // Test fallback to inherited '.toString()'
  ]

  test.only.each(
    completeTestData({
      testData,
      defaultStatus : 400,
    })
  )(
    'Options %p => message %s and status %s',
    standardErrorTest(ArgumentInvalidError)
  )
})
