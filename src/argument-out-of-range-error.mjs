/* globals ArgumentMissingError ArgumentTypeError CommonError */ // used in docs
import { ArgumentInvalidError } from './argument-invalid-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'ArgumentOutOfRangeError'

/**
 * An {@link ArgumentInvalidError} sub-type indicating a (typically user supplied) argument is of the correct time, but
 * outside the  acceptable range. Refer to {@link ArgumentInvalidError} for handling of internal argument errors.
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
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.endpointType = 'command'] - The type of "endpoint" consuming the argument.
   * @param {string|undefined} [options.packageName = undefined] - The package name.
   * @param {string|undefined} [options.endpointName = undefined] - The endpoint name.
   * @param {string|undefined} [options.argumentName = undefined] - The argument name.
   * @param {string|undefined} [options.argumentType = undefined] - The argument type.
   * @param {*} [options.argumentValue] - The argument value. Because this is value is ignored when `undefined`,
   *   consider using the string 'undefined' if it's important to display the value.
   * @param {string|number|undefined} [options.max = undefined] - The maximum value; the value must be less than or
   *   equal to this.
   * @param {string|number|undefined} [options.maxBoundary = undefined] - The upper value boundary; the value must be
   *   less than this. This value will be ignored if `max` is set.
   * @param {string|number|undefined} [options.min = undefined] - The minimum; the value must be greater than or equal
   *   to this.
   * @param {string|number|undefined} [options.minBoundary = undefined] - The lower value boundary; the value must be
   *   greater than this. This value will be ignored if `min` is set.
   * @param {string} [options.issue = 'is out of range'] - The issue with the argument.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new ArgumentOutOfRangeError() // "Function argument is out of range."
   * //  "Function 'foo()' argument is out of range. Value must be greater than or equal to 24."
   * new ArgumentOutOfRangeError({ endpointName: 'foo', argumentValue: 12, min: 24 })
   * //  "Function argument 'bar' with value '100' is out of range. Value must be greater than or equal to 'C' and less than 'D'."
   * new ArgumentInvalidError({ argumentName: 'bar', argumentValue: 'Bob', min: 'C', maxBoundary: 'D' })
   * // v "Function argument 'bar' is out of range."
   * new ArgumentInvalidError({ endpointType: 'function', argumentName: 'bar' })
   */
  constructor({ name = myName, issue = 'is out of range', ...options } = {}) {
    super({ name, issue, ...options })
    this.message += agumentMessage(options)
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentOutOfRangeError).name)

ArgumentOutOfRangeError.typeName = myName

const translateValue = (value) => {
  if (typeof value === 'object') {
    return value.toString()
  } // else

  return value
}

const agumentMessage = ({ max, maxBoundary, min, minBoundary }) => {
  let message = ''
  if (max !== undefined || maxBoundary !== undefined || min !== undefined || minBoundary !== undefined) {
    message += ' Value must be'

    if (min !== undefined) {
      message += ` greater than or equal to '${translateValue(min)}'`
    }
    else if (minBoundary !== undefined) {
      message += ` greater than '${translateValue(minBoundary)}'`
    }

    if ((max !== undefined || maxBoundary !== undefined) && (min !== undefined || minBoundary !== undefined)) {
      message += ' and'
    }

    if (max !== undefined) {
      message += ` less than or equal to '${translateValue(max)}'`
    }
    else if (maxBoundary !== undefined) {
      message += ` less than '${translateValue(maxBoundary)}'`
    }

    message += '.'
  }

  return message
}

export { ArgumentOutOfRangeError }
