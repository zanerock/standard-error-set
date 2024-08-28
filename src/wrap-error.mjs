import { ArgumentInvalidError } from './argument-invalid-error'
import { ArgumentOutOfRangeError } from './argument-out-of-range-error'
import { ArgumentTypeError } from './argument-type-error'
import { CommonError } from './common-error'
import { ConnectionError } from './connection-error'
import { NoAccessError } from './no-access-error'
import { NotFoundError } from './not-found-error'
import { SystemError } from './system-error'
import { commonErrorSettings } from './common-error-settings'
import { connectionCodes } from './lib/connection-codes'

/**
 * Wraps an `Error` in a {@link CommonError}. The `error` parameter will be set as the `cause` field of the new
 * `CommonError` instance (unless `cause` is specifically set in the `options`).
 *
 * The wrapping logic is as follows:
 * - If the `noInstanceHidingOnWrap` is `true` and the `error` class is anything but `Error`
 *   (`error.name !== 'Error'`), then results in the original error.
 * - If the `error` `code` indicates a connection error, results in a {@link ConnectionError}.
 * - If the `error` `code` is 'EACCESS' or 'EPERM', results in a {@link NoAccessError}.
 * - If the `error` `code` is 'ENOENT', results in a {@link NotFoundError}.
 * - If the `error` is an instance of `URIError` and the `wrapUserErrorType` option is `undefined`, results in a
 *   {@ArgumentInvalidError}.
 * - If the `error` is an instance of `RangeError` and the `wrapUserErrorType` option is `undefined`, results in a
 *   {@link ArgumentOutOfRangeError}.
 * - If the `error` is an instance of `TypeError` and the `wrapUserErrorType` option is `undefined`, results in a
 *   {@link ArgumentTypeError}.
 * - If the `error` in an instance of `ReferenceError` or `SyntaxError`, results in a {@SystemError}.
 * - Otherwise, results in a {@link CommonError}.
 *
 * Note, there is no special handling for `EvalError` (which [is no longer in
 * use](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError)) or `CommonError`
 * (which is
 * [non-standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/InternalError)).
 * @param {Error} error - The `Error` to be wrapped.
 * @param {object|undefined} options - The options controlling some wrapping and also passed to the wrapping
 *   `CommonError`constructor.
 * @param {boolean} options.noInstanceHidingOnWrap - If true, then if the `error` class is anything but `Error`, the
 *   original `error` will be return as is. If `undefined`, then the logic will refer to the {@link
 *   commonErrorSettings} `noInstanceHidingOnWrap` option value.
 * @param {Function} options.wrapUserErrorType - If set, then `URIError`, `RangeError`, and `TypeError` will be wrapped
 *   in a new error of that `Class`. Otherwise, the logic will refer to the {@link commonErrorSettings}
 *   `wrapUserErrorType`, which if undefined will result in the appropriate {@ArgumentInvalidError} analog.
 * @returns {Array.<Error, boolean>} - An array containing either the original `Error` or the new wrapping `CommonError`
 *   and a boolean indicating whether the `error` was wrapped (`true`) or not (`false`).
 */
const wrapError = (error, options = {}) => {
  const { code } = error

  const noInstanceHidingOnWrap =
    options.noInstanceHidingOnWrap ||
    commonErrorSettings('noInstanceHidingOnWrap')
  if (noInstanceHidingOnWrap === true && error.name !== 'Error') {
    return [error, false]
  }

  const wrapUserErrorType =
    options.wrapUserErrorType || commonErrorSettings('wrapUserErrorType')

  if (code in connectionCodes) {
    // cause and code come first in case the user wants to override them in the options
    return [new ConnectionError({ cause: error, code, ...options }), true]
  } else if (code === 'EACCESS' || code === 'EPERM') {
    return [new NoAccessError({ cause: error, code, ...options }), true]
  } else if (code === 'ENOENT') {
    return [new NotFoundError({ cause: error, code, ...options }), true]
  } else if (error instanceof URIError) {
    const WrapType = wrapUserErrorType || ArgumentInvalidError

    return [new WrapType({ cause: error, code, ...options }), true]
  } else if (error instanceof RangeError) {
    const WrapType = wrapUserErrorType || ArgumentOutOfRangeError

    return [new WrapType({ cause: error, code, ...options }), true]
  } else if (error instanceof TypeError) {
    const WrapType = wrapUserErrorType || ArgumentTypeError

    return [new WrapType({ cause: error, code, ...options }), true]
  } else if (error instanceof ReferenceError || error instanceof SyntaxError) {
    return [new SystemError({ cause: error, code, ...options }), true]
  } else {
    return [new CommonError({ cause: error, code, ...options }), true]
  }
}

export { wrapError }
