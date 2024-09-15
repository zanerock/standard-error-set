/* globals ArgumentMissingError ArgumentOutOfRangeError CommonError */ // in the docs
import { ArgumentInvalidError } from './argument-invalid-error'
import {
  ignoreParameter,
  includeParameterInMessage
} from '../../util/include-parameter-in-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'ArgumentTypeError'
const defaultIssue = 'is wrong type'
const myDefaults = { issue : defaultIssue }

/**
 * An {@link ArgumentInvalidError} sub-type indicating a (typically user supplied) argument is not the correct type.
 * Refer to {@link ArgumentInvalidError} for handling of internal argument errors.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ArgumentInvalidError} - General argument error when no more specific error fits.
 * - {@link ArgumentMissingError} - Indicates the argument is missing or empty.
 * - {@link ArgumentOutOfRangeError} - Indicates an argument is of the correct type, but outside the acceptable range.
 * @category Argument errors
 */
const ArgumentTypeError = class extends ArgumentInvalidError {
  /**
   * The {@link ArgumentTypeError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   {{< common-endpoint-parameters defaultEndpointType='command' }}
   * @param {string|undefined} [options.argumentName = undefined] - The argument name.
   * @param {string|undefined} [options.argumentType = undefined] - The (expected) argument type.
   * @param {string|undefined} [options.receivedType = undefined] - The actual type of the argument. If this is not
   *   set, but `argumentValue` is provided then unless `receivedType` is ignored, the `typeof argumentValue` will be
   *   used as the received type.
   * @param {*} [options.argumentValue = undefined] - The value of the argument; though we recommend to leave this
   *   undefined. The value is generally not important since the type is incorrect.
   * @param {string} [options.issue = 'is wrong type'] - The issue with the argument.
   {{> common-hidden-parameters }}
   * @example
   * new ArgumentInvalidError() // "Function argument is wrong type."
   * //  "Function 'my-package#foo()' argument is wrong type."
   * new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo()'})
   * //  "Function 'my-package#foo()' argument with value 'undefined' is wrong type."
   * new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo()', argumentName: 'bar', argumentValue: 'undefined' })
   * // v "Function argument 'bar' is wrong type."
   * new ArgumentInvalidError({ endpointType: 'function', argumentName: 'bar' })
   */
  constructor(
    { name = myName, issue = defaultIssue, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    super({ name, issue, ...options }, defaults)
    this.message += augmentMessage(options)
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentTypeError).name)

ArgumentTypeError.typeName = myName

const augmentMessage = (options) => {
  if (options.message !== undefined) {
    return ''
  }

  if (
    includeParameterInMessage('receivedType', options)
    || (!Object.hasOwn(options, 'receivedType')
      && !ignoreParameter('receivedType', options)
      && options.argumentValue !== undefined)
  ) {
    let { receivedType } = options
    receivedType = receivedType || typeof options.argumentValue

    return ` Received type '${receivedType}'.`
  } // else

  return ''
}

export { ArgumentTypeError }
