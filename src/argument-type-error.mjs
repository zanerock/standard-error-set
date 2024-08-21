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
   * @param {object|undefined} options - The error options.
   * @param {string|undefined} options.packageName - The package name (optional).
   * @param {string|undefined} options.functionName - The function name (optional).
   * @param {string|undefined} options.argumentName - The argument name (optional).
   * @param {string|undefined} options.argumentValue - The value of the argument; though we recommend to leave this
   *   undefined. The value is generally not important since the type is incorrect.
   * @param {string|undefined} options.expectedType - The expected type of the argument.
   * @param {string|undefined} options.receivedType - The actual type of the argument.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * new ArgumentInvalidError() // "Function argument is missing or empty."
   * // v yields: "Function 'my-package#foo()' argument is missing or empty."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo'})
   * // v yields: "Function 'my-package#foo()' argument with value 'undefined' is missing or empty."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 'undefined' })
   */
  constructor ({ name = myName, ...options }) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentTypeError).name)

ArgumentTypeError.typeName = myName

const generateMessage = ({ expectedType, receivedType, ...options }) => {
  const message = generateBadArgumentMessage('is the wrong type', options)
  let typeMessage = ''
  if (expectedType !== undefined) {
    typeMessage = `expected type '${expectedType}'`
  }
  if (receivedType !== undefined) {
    if (expectedType) {
      typeMessage += ', but '
    }
    typeMessage += `recieved type '${receivedType}'`
  }

  return message +
    (typeMessage === undefined
      ? ''
      : ' ' + typeMessage.charAt(0).toUpperCase() + typeMessage.slice(1) + '.'
    )
}

export { ArgumentTypeError }
