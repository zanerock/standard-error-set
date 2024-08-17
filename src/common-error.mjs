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
   * @param {object|undefined} options - Creation objects.
   * @param {string} options.name - The name of error. In general, this should match the final class name.
   * @param {string|undefined} options.message - The error message.
   * @param {string|undefined} options.code - The error code.
   * @param {number|undefined} options.status - (optional) The status override for this particular error instance.
   * @param {object|undefined} options.options - The options to pass to the `Error` super-constructor.
   * @example
   * new CommonError() // "An error has occurred."
   * new CommonError({ message : 'Oh no! An error!' }) // "Oh no! An error!"
   */
  constructor ({ message = 'An error has occurred.', status, ...options } = {}) {
    super(message, options)

    hoistErrorCode(options)

    for (const parameter of Object.keys(options || {})) {
      if (!['message', 'status', 'statusName', 'prototype'].includes(parameter)) {
        this[parameter] = options[parameter]
      }
    }

    this.status = status || mapErrorToHttpStatus(this.name)
    this.statusName = mapHttpStatusToName(this.status)
  }
}

export { CommonError }
