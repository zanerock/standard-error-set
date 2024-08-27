import { hoistErrorCode } from './lib/hoist-error-code'
import { mapErrorToHttpStatus } from './map-error-to-http-status'
import { mapHttpStatusToName } from './map-http-status-to-name'

/**
 * A base class for common errors. To create a common error of your own, extend this class.
 * ```js
 * const myName = 'MyError'
 *
 * export const MyError = class extends CommonError {
 *   constructor(foo, options) {
 *     const message = `You hit ${foo}!`
 *     super(name, message, options)
 *   }
 * }
 * MyError.typeName = myName
 * ```
 */
const CommonError = class extends Error {
  /**
   * {@CommonError} constructor.
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
  constructor({ hint, message = 'An error has occurred.', status, ...options } = {}) {
    if (hint !== undefined) {
      message += ' ' + hint
    }
    super(message, options)

    hoistErrorCode(options)

    for (const parameter of Object.keys(options)) {
      // the excluded parameters are set in the Error constructor (message), explicitly set below, or prototype
      if (!['message', 'hint', 'status', 'statusName', 'prototype'].includes(parameter)) {
        this[parameter] = options[parameter]
      }
    }

    this.hint = hint
    this.status = status || mapErrorToHttpStatus(this.name)
    this.statusName = mapHttpStatusToName(this.status)
  }
}

export { CommonError }
