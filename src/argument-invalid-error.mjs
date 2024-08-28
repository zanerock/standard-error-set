/* globals ArgumentMissingError ArgumentOutOfRangeError ArgumentTypeError mapErrorToHttpStatus */
import { CommonError } from './common-error'
import { includeParameterInMessage } from './lib/include-parameter-in-message'
import { registerParent } from './map-error-to-http-status'
import { translateValue } from './lib/translate-value'

const myName = 'ArgumentInvalidError'
const defaultEndpointType = 'command'
const defaultIssue = 'is invalid'
const myDefaults = {
  endpointType: defaultEndpointType,
  issue: defaultIssue,
}

/**
 * Indicates an invalid argument which by default is interpreted as a user supplied argument/input.
 *
 * #### Setting and interpreting `InvalidArgumentError` status
 *
 * By convention, you can disambiguate user supplied arguments vs internally supplied (e.g., from code or a service) by
 * setting and looking at the error `status`. A status of 400 indicates bad user input, while a status of 500 would
 * indicate an internal problem. This is important in error handling since the message to a user is different if they
 * can correct the input and retry vs. a problem which is internal and the user has no control over.
 *
 * If your system does not deal with user input or otherwise wishes to default `InvalidArgumentError` instances to a
 * different status code, use {@link mapErrorToHttpStatus}. Just note that this will change the default status code for
 * all `ArgumentInvalidError` instances, even those created in other packages/libraries.
 *
 * #### Alternate error classes
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
   * @param {string} [options.endpointType = 'command'] - The type of "endpoint" consuming the argument.
   * @param {string|undefined} [options.packageName = undefined] - The package name.
   * @param {string|undefined} [options.endpointName = undefined] - The endpoint name.
   * @param {string|undefined} [options.argumentName = undefined] - The argument name.
   * @param {string|undefined} [options.argumentType = undefined] - The argument type.
   * @param {*} [options.argumentValue] - The argument value. Because this is value is ignored when `undefined`,
   *   consider using the string 'undefined' if it's important to display the value.
   * @param {string} [options.issue = 'is invalid'] - The issue with the argument.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new ArgumentInvalidError() // "Function argument is invalid."
   * "Function 'my-package#foo()' argument  is invalid."
   * new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo'})
   * "Function argument 'bar' cannot be parsed."
   * new ArgumentInvalidError({ argumentName: 'bar', issue: 'cannot be parsed'})
   * "Function 'my-package#foo()' argument 'bar' with value '100' is invalid."
   * new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo', argumentName: 'bar', argumentValue: 100 })
   * // v "Function argument 'bar' is invalid."
   * new ArgumentInvalidError({ endpointType: 'function', argumentName: 'bar' })
   */
  constructor(
    {
      name = myName,
      endpointType = defaultEndpointType,
      issue = defaultIssue,
      ...options
    } = {},
    defaults = {}
  ) {
    defaults = Object.assign({}, myDefaults, defaults) // allow passed in defaults to override
    options.message =
      options.message ||
      generateMessage({ endpointType, issue, ...options }, defaults)
    super({ name, endpointType, issue, ...options }, defaults)
  }
}
// DEBUG
/*const foo = (
  bar,
  baz,
) => { console.log(bar, baz) }

foo()*/
// GUBED
registerParent(myName, Object.getPrototypeOf(ArgumentInvalidError).name)

ArgumentInvalidError.typeName = myName

const generateMessage = (options, defaults) => {
  const {
    endpointType,
    packageName,
    endpointName,
    argumentName,
    argumentType,
    argumentValue,
    issue,
  } = options

  let message = includeParameterInMessage('endpointType', options)
    ? endpointType
    : defaults.endpointType

  message = message.charAt(0).toUpperCase() + message.slice(1) + ' '

  if (includeParameterInMessage('packageName', options)) {
    message +=
      endpointName === undefined
        ? `in package '${packageName}' `
        : `'${packageName}#`
  }
  if (includeParameterInMessage('endpointName', options)) {
    message += `${packageName === undefined ? "'" : ''}${endpointName}()' `
  }
  message += 'argument '
  if (includeParameterInMessage('argumentName', options)) {
    message += `'${argumentName}' `
  }
  if (includeParameterInMessage('argumentType', options)) {
    message += `type '${argumentType}' `
  }
  if (includeParameterInMessage('argumentValue', options)) {
    message += `with value '${translateValue(argumentValue)}' `
  }
  message += `${includeParameterInMessage('issue', options) ? issue : defaults.issue}.`

  return message
}

export { ArgumentInvalidError }
