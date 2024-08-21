import { ArgumentInvalidError } from '../argument-invalid-error'
import { ArgumentOutOfRangeError } from '../argument-out-of-range-error'
import { ArgumentTypeError } from '../argument-type-error'
import { CommonError } from '../common-error'
import { ConnectionError } from '../connection-error'
import { NoAccessError } from '../no-access-error'
import { NotFoundError } from '../not-found-error'
import { SystemError } from '../system-error'
import { commonErrorSettings } from '../common-error-settings'
import { connectionCodes } from '../lib/connection-codes'
import { wrapError } from '../wrap-error'

describe('wrapError', () => {
  afterEach(() => commonErrorSettings()) // resets any custom settings

  test.each([
    ['RangeError', RangeError, ArgumentOutOfRangeError],
    ['ReferenceError', ReferenceError, SystemError],
    ['SyntaxError', SyntaxError, SystemError],
    ['TypeError', TypeError, ArgumentTypeError],
    ['URIError', URIError, ArgumentInvalidError],
    ['Error', Error, CommonError],
  ])('wraps %s to appropriate type', (description, CauseClass, ExpectedClass) => {
    const [wrappedError, isWrapped] = wrapError(new CauseClass())
    expect(wrappedError instanceof ExpectedClass).toBe(true)
    expect(isWrapped).toBe(true)
  })

  const codeTests = Object.keys(connectionCodes).map((code) => [code, ConnectionError])
  codeTests.push(...[
    ['EACCESS', NoAccessError],
    ['EPERM', NoAccessError],
    ['ENOENT', NotFoundError],
    ['EBLAH', CommonError],
  ])

  test.each(codeTests)('wraps error with code %s to appropriate type', (code, ExpectedClass) => {
    const cause = new Error()
    cause.code = code
    const [wrappedError, isWrapped] = wrapError(cause)
    expect(wrappedError instanceof ExpectedClass).toBe(true)
    expect(isWrapped).toBe(true)
  })

  const noInstanceHidingOnWrapTests = [
    ['RangeError', RangeError, RangeError],
    ['TypeError', TypeError, TypeError],
    ['URIError', URIError, URIError],
  ]

  test.each(noInstanceHidingOnWrapTests)("wraps %s to appropriate error when 'noInstanceHidingOnWrap' is true (constructor)", (description, CauseClass, ExpectedClass) => {
    const [wrappedError, isWrapped] = wrapError(new CauseClass(), { noInstanceHidingOnWrap : true })
    expect(wrappedError instanceof ExpectedClass).toBe(true)
    expect(isWrapped).toBe(false)
  })

  test.each(noInstanceHidingOnWrapTests)("wraps %s to appropriate error when 'noInstanceHidingOnWrap' is true (common setting)", (description, CauseClass, ExpectedClass) => {
    commonErrorSettings('noInstanceHidingOnWrap', true)
    const [wrappedError, isWrapped] = wrapError(new CauseClass())
    expect(wrappedError instanceof ExpectedClass).toBe(true)
    expect(isWrapped).toBe(false)
  })

  test.each([
    ['ReferenceError', ReferenceError],
    ['SyntaxError', SyntaxError],
  ])('wraps %s in SystemError', (description, CauseClass) => {
    const [wrappedError, isWrapped] = wrapError(new CauseClass())
    expect(wrappedError instanceof SystemError).toBe(true)
    expect(isWrapped).toBe(true)
  })

  // TODO: Test options get passed to the wrapping error in all cases
})
