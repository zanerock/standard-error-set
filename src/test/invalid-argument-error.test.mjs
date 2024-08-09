import { InvalidArgumentError } from '../invalid-argument-error'

describe('InvalidArgumentError', () => {
  const causeError = new Error()

  test.each([
    [[], /Function called with invalid arguments/, 400, undefined],
    [[null], /Function called with invalid arguments/, 400, undefined],
    [[{ status : 401 }], /Function called with invalid arguments/, 401, undefined],
    [['foo()'], /Function 'foo\(\)'/, 400, undefined],
    [['foo()', 'bar'], /Function 'foo\(\)' argument 'bar'/, 400, undefined],
    [['foo()', 'bar', 100], /Function 'foo\(\)' argument 'bar' has invalid value '100'./, 400, undefined],
    [[{ message : 'Foo is bad', status : 401 }], /Foo is bad/, 401, undefined],
    [[{ message : 'Foo is bad', cause : causeError, status : 401 }], /Foo is bad/, 401, causeError],
    [['foo()', { cause : causeError, status : 401 }], /Function 'foo\(\)'/, 401, causeError],
    [['foo()', 'bar', { cause : causeError, status : 401 }], /Function 'foo\(\)' argument 'bar'/, 401, causeError],
    [
      ['foo()', 'bar', 100, { cause : causeError, status : 401 }],
      /Function 'foo\(\)' argument 'bar' has invalid value '100'./,
      401,
      causeError
    ]
  ])('Args %p => message %s and status %s', (args, messageMatcher, expectedStatus, expectedCause) => {
    const error = new InvalidArgumentError(...args)
    expect(error.message).toMatch(messageMatcher)
    expect(error.status).toBe(expectedStatus)
    expect(error.statusName).toBeTruthy()
    expect(error.cause).toBe(expectedCause)
  })
})
