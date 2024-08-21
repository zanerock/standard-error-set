/* globals ArgumentMissingError ArgumentTypeError CommonError */ // used in docs
import { ArgumentInvalidError } from './argument-invalid-error'
import { generateBadArgumentMessage } from './lib/generate-bad-argument-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'ArgumentOutOfRangeError'

/**
 * An {@link ArgumentInvalidError} sub-type indicating an argument is of the correct time, but outside the acceptable range.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ArgumentInvalidError} - General argument error when no more specific error fits.
 * - {@link ArgumentMissingError} - For when the argument is required, but missing or empty.
 * - {@link ArgumentTypeError} - Indicates an argument is an incorrect type.
 */
const ArgumentOutOfRangeError = class extends ArgumentInvalidError {
  /**
   * The {@link ArgumentOutOfRangeError} constructor.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object|undefined} options - The error options.
   * @param {string|undefined} options.packageName - The package name (optional).
   * @param {string|undefined} options.functionName - The function name (optional).
   * @param {string|undefined} options.argumentName - The argument name (optional).
   * @param {string|undefined} options.argumentValue - The argument value (optional). Because this is value is ignored
   *   when `undefined`, consider using the string 'undefined' if it's important to display the value.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.
   * @param {string|number|undefined} options.max - The maximum value; the value must be less than or equal to this.
   * @param {string|number|undefined} options.maxBoundary - The upper value boundary; the value must be less than this. This value will be ignored if `max` is set.
   * @param {string|number|undefined} options.min - The minimum; the value must be greater than or equal to this.`
   * @param {string|number|undefined} options.minBoundary - The lower value boundary; the value must be greater than this. This value will be ignored if `min` is set.
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * new ArgumentOutOfRangeError() // "Function argument is out of range."
   * // v yields: "Function 'foo()' argument is out of range. Value must be greater than or equal to 24."
   * new ArgumentOutOfRangeError({ functionName: 'foo', argumentValue: 12, min: 24 })
   * // v yields: "Function argument 'bar' with value '100' is out of range. Value must be greater than or equal to 'C' and less than 'D'."
   * new ArgumentInvalidError({ argumentName: 'bar', argumentValue: 'Bob', min: 'C', maxBoundary: 'D' })
   */
  constructor({ name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentOutOfRangeError).name)

ArgumentOutOfRangeError.typeName = myName

const generateMessage = ({ max, maxBoundary, min, minBoundary, ...options }) => {
  let message = generateBadArgumentMessage('is out of range', options)
  if (max === undefined || maxBoundary !== undefined || min === undefined || minBoundary !== undefined) {
    message += ' Value must be'

    if (min !== undefined) {
      message += ` greater than or equal to '${min}'`
    }
    else if (minBoundary !== undefined) {
      message += ` greater than '${minBoundary}'`
    }

    if ((max !== undefined || maxBoundary !== undefined) && (min !== undefined || minBoundary !== undefined)) {
      message += ' and'
    }

    if (max !== undefined) {
      message += ` less than or equal to '${max}'`
    }
    else if (maxBoundary !== undefined) {
      message += ` less than '${maxBoundary}'`
    }

    message += '.'
  }

  return message
}

export { ArgumentOutOfRangeError }
