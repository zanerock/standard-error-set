/* globals ArgumentOutOfRangeError ArgumentTypeError CommonError */ // in the docs
import { ArgumentInvalidError } from './argument-invalid-error'
import { generateBadArgumentMessage } from './lib/generate-bad-argument-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'ArgumentMissingError'

/**
 * An {@link ArgumentInvalidError} sub-type indicating an argument is missing or empty (typically `null`, `undefined`,
 * or '').
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ArgumentInvalidError} - General argument error when no more specific error fits.
 * - {@link ArgumentOutOfRangeError} - Indicates an argument is of the correct type, but outside the acceptable range.
 * - {@link ArgumentTypeError} - Indicates an argument is an incorrect type.
 */
const ArgumentMissingError = class extends ArgumentInvalidError {
  /**
   * The {@link ArgumentMissingError} constructor.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.packageName = undefined] - The package name.
   * @param {string|undefined} [options.functionName = undefined] - The function name.
   * @param {string|undefined} [options.argumentName = undefined] - The argument name.
   * @param {*} [options.argumentValue] - The argument value. Because this is value is ignored when `undefined`, 
   *   consider using the string 'undefined' if it's important to display the value.
   * @param {string} [options.issue = 'is missing or empty'] - The issue with the argument. You can pass in a more 
   *   specific explanation if you like.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new ArgumentInvalidError() // "Function argument is missing or empty."
   * // v yields: "Function 'my-package#foo()' argument is missing or empty."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo'})
   * // v yields: "Function 'my-package#foo()' argument with value 'undefined' is missing or empty."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 'undefined' })
   */
  constructor({ name = myName, issue = 'is missing or empty', ...options } = {}) {
    options.message = options.message || generateBadArgumentMessage({ issue, ...options })
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentMissingError).name)

ArgumentMissingError.typeName = myName

export { ArgumentMissingError }
