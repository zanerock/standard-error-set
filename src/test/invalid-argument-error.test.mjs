import { InvalidArgumentError } from '../invalid-argument-error'

describe('InvalidArgumentError', () => {
  const causeError = new Error()

  test.each([
    [[], /Function argument has invalid value./, 400, undefined],
    [[null], /Function argument has invalid value./, 400, undefined],
    [[{ status : 401 }], /Function argument has invalid value./, 401, undefined],
    [['my-package', 'foo'], /Function 'my-package#foo\(\)'/, 400, undefined],
    [[undefined, 'foo'], /Function 'foo\(\)'/, 400, undefined],
    [[undefined, 'foo', 'bar'], /Function 'foo\(\)' argument 'bar'/, 400, undefined],
    [[undefined, 'foo', 'bar', 100], /Function 'foo\(\)' argument 'bar' has invalid value '100'./, 400, undefined],
    [[{ message : 'Foo is bad', status : 401 }], /Foo is bad/, 401, undefined],
    [[{ message : 'Foo is bad', cause : causeError, status : 401 }], /Foo is bad/, 401, causeError],
    [[undefined, 'foo', { cause : causeError, status : 401 }], /Function 'foo\(\)'/, 401, causeError],
    [
      [undefined, 'foo', 'bar', { cause : causeError, status : 401 }],
      /Function 'foo\(\)' argument 'bar'/,
      401,
      causeError
    ],
    [
      [undefined, 'foo', 'bar', 100, { cause : causeError, status : 401 }],
      /Function 'foo\(\)' argument 'bar' has invalid value '100'./,
      401,
      causeError
    ],
    [
      [{ functionName : 'foo', argumentName : 'bar', argumentValue : 100, cause : causeError, status : 401 }],
      /Function 'foo\(\)' argument 'bar' has invalid value '100'./,
      401,
      causeError
    ],
    [
      ['my-package', { functionName : 'foo', argumentName : 'bar', argumentValue : 100, cause : causeError, status : 401 }],
      /Function 'my-package#foo\(\)' argument 'bar' has invalid value '100'./,
      401,
      causeError
    ],
    [['my-package'], /Function in package 'my-package' argument has invalid value./, 400, undefined],
    [
      ['my-package', 'foo', 'bar', { bar : 100 }, { cause : causeError, status : 401 }],
      /Function 'my-package#foo\(\)' argument 'bar' has invalid value '{"bar":100}'./,
      401,
      causeError
    ],
    [
      ['my-package', 'foo', 'bar', { bar : 100 }],
      /Function 'my-package#foo\(\)' argument 'bar' has invalid value./,
      400,
      undefined
    ],
    [
      ['my-package', 'foo', 'bar', { bar : 100 }, null],
      /Function 'my-package#foo\(\)' argument 'bar' has invalid value '{"bar":100}'./,
      400,
      undefined
    ]
  ])('Args %p => message %s and status %s', (args, messageMatcher, expectedStatus, expectedCause) => {
    const error = new InvalidArgumentError(...args)
    expect(error.message).toMatch(messageMatcher)
    expect(error.status).toBe(expectedStatus)
    expect(error.statusName).toBeTruthy()
    expect(error.cause).toBe(expectedCause)
  })
})
