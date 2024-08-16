/* globals ArgumentMissingError ArgumentOutOfRangeError */
import { CommonError } from './common-error'
import { generateBadArgumentMessage } from './lib/generate-bad-argument-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'ArgumentInvalidError'

/**
 * Indicates an invalid argument was passed to a function.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ArgumentMissingError} - For when the argument is required, but missing or empty.
 * - {@link ArgumentOutOfRangeError} - For when the argument is of the proper type, but outside the acceptable range.
 */
const ArgumentInvalidError = class extends CommonError {
  /**
   * The {@link ArgumentInvalidError} constructor.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object|undefined} options - The error options.
   * @param {string|undefined} options.packageName - The package name (optional).
   * @param {string|undefined} options.functionName - The function name (optional).
   * @param {string|undefined} options.argumentName - The argument name (optional).
   * @param {string|undefined} options.argumentValue - The argument value (optional). Because this is value is ignored 
   *   when `undefined`, consider using the string 'undefined' if it's important to display the value.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * new ArgumentInvalidError() // "Function argument is invalid."
   * // v yields: "Function 'my-package#foo()' argument  is invalid."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo'})
   * // v yields: "Function 'my-package#foo()' argument 'bar' with value '100' is invalid."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 100 })
   */
  constructor ({ name = myName, ...options } = {}) {
    options.message = options.message || generateBadArgumentMessage('is invalid', options)

    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentInvalidError).name)

ArgumentInvalidError.typeName = myName

export { ArgumentInvalidError }
