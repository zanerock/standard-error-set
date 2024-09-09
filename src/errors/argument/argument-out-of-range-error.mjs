/* globals ArgumentMissingError ArgumentTypeError CommonError */ // used in docs
import { ArgumentInvalidError } from './argument-invalid-error'
import { includeParameterInMessage } from '../../util/include-parameter-in-message'
import { registerParent } from '../../settings/map-error-to-http-status'
import { translateValue } from '../lib/translate-value'

const myName = 'ArgumentOutOfRangeError'
const defaultIssue = 'is out of range'
const myDefaults = { issue : defaultIssue }

/**
 * An {@link ArgumentInvalidError} sub-type indicating a (typically user supplied) argument is of the correct time, but
 * outside the  acceptable range. Refer to {@link ArgumentInvalidError} for handling of internal argument errors.
 *
 * The [`includeForMessage`](#common-constructor-options-ignore-for-message] option for this function recognizes the
 * special 'boundary' value. If included, then the entire boundary description (based on the `max`, `min`, etc.
 * options) will be suppressed. And while it is possible to exclude the individual boundary parameters, excluding a
 * subset would be strange.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ArgumentInvalidError} - General argument error when no more specific error fits.
 * - {@link ArgumentMissingError} - For when the argument is required, but missing or empty.
 * - {@link ArgumentTypeError} - Indicates an argument is an incorrect type.
 * @category Argument errors
 */
const ArgumentOutOfRangeError = class extends ArgumentInvalidError {
  /**
   * The {@link ArgumentOutOfRangeError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
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
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new ArgumentOutOfRangeError() // "Function argument is out of range."
   * //  "Function 'foo()' argument is out of range. Value must be greater than or equal to 24."
   * new ArgumentOutOfRangeError({ endpointName: 'foo', argumentValue: 12, min: 24 })
   * //  "Function argument 'bar' with value '100' is out of range. Value must be greater than or equal to 'C' and less than 'D'."
   * new ArgumentInvalidError({ argumentName: 'bar', argumentValue: 'Bob', min: 'C', maxBoundary: 'D' })
   * // v "Function argument 'bar' is out of range."
   * new ArgumentInvalidError({ endpointType: 'function', argumentName: 'bar' })
   */
  constructor(
    { name = myName, issue = defaultIssue, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    super({ name, issue, ...options }, defaults)
    this.message += agumentMessage(options)
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentOutOfRangeError).name)

ArgumentOutOfRangeError.typeName = myName

const agumentMessage = (options) => {
  const { ignoreForMessage, max, maxBoundary, min, minBoundary } = options

  if (ignoreForMessage?.includes('boundary') === true) {
    return ''
  }

  let message = ''

  const includeMax = includeParameterInMessage('max', options)
  const includeMin = includeParameterInMessage('min', options)
  const includeMaxBoundary = includeParameterInMessage('maxBoundary', options)
  const includeMinBoundary = includeParameterInMessage('minBoundary', options)

  if (
    includeMax === true
    || includeMin === true
    || includeMaxBoundary === true
    || includeMinBoundary === true
  ) {
    message += ' Value must be'

    if (includeMin === true) {
      message += ` greater than or equal to '${translateValue(min)}'`
    }
    else if (includeMinBoundary === true) {
      message += ` greater than '${translateValue(minBoundary)}'`
    }

    if (
      (includeMax === true || includeMaxBoundary === true)
      && (includeMin === true || includeMinBoundary === true)
    ) {
      message += ' and'
    }

    if (includeMax === true) {
      message += ` less than or equal to '${translateValue(max)}'`
    }
    else if (includeMaxBoundary === true) {
      message += ` less than '${translateValue(maxBoundary)}'`
    }

    message += '.'
  }

  return message
}

export { ArgumentOutOfRangeError }
