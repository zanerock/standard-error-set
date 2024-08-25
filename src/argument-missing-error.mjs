/* globals ArgumentOutOfRangeError ArgumentTypeError CommonError */ // in the docs
import { ArgumentInvalidError } from './argument-invalid-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'ArgumentMissingError'

/**
 * An {@link ArgumentInvalidError} sub-type indicating a (typically user supplied) argument is missing or empty (
 * typically `null`, `undefined`, or ''). Refer to {@link ArgumentInvalidError} for handling of internal argument
 * errors.
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
   * @param {string} [options.endpointType = 'command'] - The type of "endpoint" consuming the argument.
   * @param {string|undefined} [options.packageName = undefined] - The package name.
   * @param {string|undefined} [options.endpointName = undefined] - The endpoint name.
   * @param {string|undefined} [options.argumentName = undefined] - The argument name.
   * @param {string|undefined} [options.argumentType = undefined] - The argument type.
   * @param {*} [options.argumentValue] - The argument value. Because this is value is ignored when `undefined`,
   *   consider using the string 'undefined' if it's important to display the value.
   * @param {string} [options.issue = 'is missing or empty'] - The issue with the argument. You can pass in a more
   *   specific explanation if you like.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new ArgumentInvalidError() // "Function argument is missing or empty."
   * //  "Function 'my-package#foo()' argument is missing or empty."
   * new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo'})
   * //  "Function 'my-package#foo()' argument with value 'undefined' is missing or empty."
   * new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo', argumentName: 'bar', argumentValue: 'undefined' })
   * // v "Function argument 'bar' is missing or empty."
   * new ArgumentInvalidError({ endpointType: 'function', argumentName: 'bar' })
   */
  constructor({ name = myName, issue = 'is missing or empty', ...options } = {}) {
    super({ name, issue, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentMissingError).name)

ArgumentMissingError.typeName = myName

export { ArgumentMissingError }
