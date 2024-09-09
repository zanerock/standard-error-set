/* globals ArgumentInvalidError */
import { hoistErrorCode } from './lib/hoist-error-code'
import { includeParameterInMessage } from '../util/include-parameter-in-message'
import { mapErrorToHttpStatus } from '../settings/map-error-to-http-status'
import { mapHttpStatusToName } from '../settings/map-http-status-to-name'

/**
 * A base class for common errors. To create a common error of your own, extend this class.
 * ```js
 * import { CommonError, registerParent } from 'standard-error-set'
 * const myName = 'MyError'
 *
 * export const MyError = class extends CommonError {
 *   constructor({ name = myName, ...options}) {
 *     const message = "Now you've done it!"
 *     super({ name, message, ...options })
 *   }
 * }
 * MyError.typeName = myName
 *
 * registerParent(myName, Object.getPrototypeOf(MyError).name)
 * ```
 *
 * If your new error creates a [constructed message](#constructed-message) from parameters, refer to {@link
 * includeParameterInMessage} and {@link ArgumentInvalidError} source code for an example of how to use it.
 * @category General errors
 */
const CommonError = class extends Error {
  /**
   * {@link CommonError} constructor.
   * 
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} options.name - The name of error. In general, this should match the final class name.
   * @param {string} [options.message = 'An error has occurred.'] - The error message.
   * @param {string|undefined} [options.code = undefined] - The error code.
   * @param {string|undefined} [options.hint = undefined] - Optional hint regarding rectifying the error.
   * @param {number|undefined} [options.status = undefined] - The HTTP status associated with the error. If undefined,
   *   this will be automatically set according to the [@link mapErrorToHttpStatus | configured error mappings].
   * @param {object|undefined} [options.options = undefined] - The options to pass to the `Error` super-constructor.
   * @example
   * new CommonError() // "An error has occurred."
   * new CommonError({ message : 'Oh no! An error!' }) // "Oh no! An error!"
   */
  constructor({
    hint,
    message = 'An error has occurred.',
    status,
    ...options
  } = {}) {
    if (includeParameterInMessage('hint', { hint, ...options })) {
      message += ' ' + hint
    }
    super(message, options)

    hoistErrorCode(options)

    for (const parameter of Object.keys(options)) {
      // the excluded parameters are set in the Error constructor (message), explicitly set below, or prototype
      if (
        !['message', 'hint', 'status', 'statusName', 'prototype'].includes(
          parameter
        )
      ) {
        this[parameter] = options[parameter]
      }
    }

    this.hint = hint
    this.status = status || mapErrorToHttpStatus(this.name)
    this.statusName = mapHttpStatusToName(this.status)
  }
}

export { CommonError }
