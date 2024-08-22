/* globals ArgumentMissingError ArgumentOutOfRangeError CommonError */ // in the docs
import { ArgumentInvalidError } from './argument-invalid-error'
import { generateBadArgumentMessage } from './lib/generate-bad-argument-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'ArgumentTypeError'

/**
 * An {@link ArgumentInvalidError} sub-type indicating an argument is not the correct type.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ArgumentInvalidError} - General argument error when no more specific error fits.
 * - {@link ArgumentMissingError} - Indicates the argument is missing or empty.
 * - {@link ArgumentOutOfRangeError} - Indicates an argument is of the correct type, but outside the acceptable range.
 */
const ArgumentTypeError = class extends ArgumentInvalidError {
  /**
   * The {@link ArgumentTypeError} constructor.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.packageName = undefined] - The package name.
   * @param {string|undefined} [options.functionName = undefined] - The function name.
   * @param {string|undefined} [options.argumentName = undefined] - The argument name.
   * @param {*} [options.argumentValue = undefined] - The value of the argument; though we recommend to leave this
   *   undefined. The value is generally not important since the type is incorrect.
   * @param {string|undefined} [options.expectedType = undefined] - The expected type of the argument.
   * @param {string|undefined} [options.receivedType = undefined] - The actual type of the argument.
   * @param {string} [options.issue = 'is wrong type'] - The issue with the argument.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new ArgumentInvalidError() // "Function argument is wrong type."
   * // v yields: "Function 'my-package#foo()' argument is wrong type."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo'})
   * // v yields: "Function 'my-package#foo()' argument with value 'undefined' is wrong type."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 'undefined' })
   * // v yields: "Function argument is wrong type;"
   */
  constructor({ name = myName, issue = 'is wrong type', ...options } = {}) {
    options.message = options.message || generateMessage({ issue, ...options })
    super({ name, issue, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentTypeError).name)

ArgumentTypeError.typeName = myName

const generateMessage = ({ expectedType, receivedType, ...options }) => {
  let message = generateBadArgumentMessage(options)
  let typeMessage = ''
  if (expectedType !== undefined) {
    typeMessage = `expected type '${expectedType}'`
  }
  if (receivedType !== undefined) {
    if (expectedType) {
      typeMessage += ', but '
    }
    typeMessage += `received type '${receivedType}'`
  }

  if (typeMessage !== '') {
    message += ' ' + typeMessage.charAt(0).toUpperCase() + typeMessage.slice(1) + '.'
  }

  return message
}

export { ArgumentTypeError }
