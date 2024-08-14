import { InvalidArgumentError } from '../invalid-argument-error'

describe('InvalidArgumentError', () => {
  const causeError = new Error()

  test.each([
    [undefined, /Function argument has invalid value./, 400, undefined],
    [{ status : 401 }, /Function argument has invalid value./, 401, undefined],
    [{ packageName: 'my-package', functionName: 'foo' }, /Function 'my-package#foo\(\)'/, 400, undefined],
    [{ functionName: 'foo' }, /Function 'foo\(\)'/, 400, undefined],
    [{ functionName: 'foo', argumentName: 'bar' }, /Function 'foo\(\)' argument 'bar'/, 400, undefined],
    [
      { functionName: 'foo', argumentName: 'bar', argumentValue: 100 }, 
      /Function 'foo\(\)' argument 'bar' has invalid value '100'./, 
      400, 
      undefined
    ],
    [{ message : 'Foo is bad', status : 401 }, /Foo is bad/, 401, undefined],
    [{ message : 'Foo is bad', cause : causeError, status : 401 }, /Foo is bad/, 401, causeError],
    [{ functionName: 'foo', cause : causeError, status : 401 }, /Function 'foo\(\)'/, 401, causeError],
    [
      { functionName: 'foo', argumentName: 'bar', cause : causeError, status : 401 },
      /Function 'foo\(\)' argument 'bar'/,
      401,
      causeError
    ],
    [
      { functionName: 'foo', argumentName: 'bar', argumentValue: 100, cause : causeError, status : 401 },
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
      { packageName: 'my-package', functionName : 'foo', argumentName : 'bar', argumentValue : 100, cause : causeError, status : 401 },
      /Function 'my-package#foo\(\)' argument 'bar' has invalid value '100'./,
      401,
      causeError
    ],
    [{ packageName: 'my-package' }, /Function in package 'my-package' argument has invalid value./, 400, undefined],
    [
      { packageName: 'my-package', functionName: 'foo', argumentName: 'bar', bar : 100 },
      /Function 'my-package#foo\(\)' argument 'bar' has invalid value./,
      400,
      undefined
    ]
  ])('Options %p => message %s and status %s', (options, messageMatcher, expectedStatus, expectedCause) => {
    const error = new InvalidArgumentError(options)
    expect(error.message).toMatch(messageMatcher)
    expect(error.status).toBe(expectedStatus)
    expect(error.statusName).toBeTruthy()
    expect(error.cause).toBe(expectedCause)
  })
})
