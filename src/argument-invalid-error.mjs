/* globals ArgumentMissingError ArgumentOutOfRangeError ArgumentTypeError */
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
 * - {@link ArgumentTypeError} - Indicates an argument is an incorrect type.
 */
const ArgumentInvalidError = class extends CommonError {
  /**
   * The {@link ArgumentInvalidError} constructor.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.packageName = undefined] - The package name.
   * @param {string|undefined} [options.functionName = undefined] - The function name.
   * @param {string|undefined} [options.argumentName = undefined] - The argument name.
   * @param {*} [options.argumentValue] - The argument value. Because this is value is ignored when `undefined`, 
   *   consider using the string 'undefined' if it's important to display the value.
   * @param {string} [options.issue = 'is invalid'] - The issue with the argument.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * new ArgumentInvalidError() // "Function argument is invalid."
   * // v yields: "Function 'my-package#foo()' argument  is invalid."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo'})
   * // v yields: "Function argument 'bar' cannot be parsed."
   * new ArgumentInvalidError({ argumentName: 'bar', issue: 'cannot be parsed'})
   * // v yields: "Function 'my-package#foo()' argument 'bar' with value '100' is invalid."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 100 })
   */
  constructor({ name = myName, issue = 'is invalid', ...options } = {}) {
    options.message = options.message || generateBadArgumentMessage({ issue, ...options })

    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentInvalidError).name)

ArgumentInvalidError.typeName = myName

export { ArgumentInvalidError }
