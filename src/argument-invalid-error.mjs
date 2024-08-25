/* globals ArgumentMissingError ArgumentOutOfRangeError ArgumentTypeError mapErrorToHttpStatus */
import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'
import { translateValue } from './lib/translate-value'

const myName = 'ArgumentInvalidError'

/**
 * Indicates an invalid, typically user supplied argument. By default, this error and any sub-types map to an HTTP
 * status of 400 ("Bad Request"). If the status codes are relevant, remember to {@linkplain mapErrorToHttpStatus |
 * change the error to HTTP status mapping} or pass in the `status` option when creating the error.
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
   * @param {string|undefined} [options.hint = undefined] - Optional hint re rectifying argument issue. This should be 
   *   a complete sentence if defined.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
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
  constructor({ name = myName, endpointType = 'command', issue = 'is invalid', ...options } = {}) {
    options.message = options.message || generateMessage({ endpointType, issue, ...options })
    super({ name, endpointType, issue, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentInvalidError).name)

ArgumentInvalidError.typeName = myName

const generateMessage = ({ 
  endpointType, 
  packageName, 
  endpointName, 
  argumentName, 
  argumentType, 
  argumentValue, 
  hint, 
  issue 
}) => {
  let message = endpointType.charAt(0).toUpperCase() + endpointType.slice(1) + ' '
  if (packageName !== undefined) {
    message += endpointName === undefined ? `in package '${packageName}' ` : `'${packageName}#`
  }
  if (endpointName !== undefined) {
    message += `${packageName === undefined ? "'" : ''}${endpointName}()' `
  }
  message += 'argument '
  if (argumentName !== undefined) {
    message += `'${argumentName}' `
  }
  if (argumentType !== undefined) {
    message += `type '${argumentType}' `
  }
  if (argumentValue !== undefined) {
    message += `with value '${translateValue(argumentValue)}' `
  }
  message += `${issue}.`

  if (hint !== undefined) {
    message += ' ' + hint
  }

  return message
}

export { ArgumentInvalidError }
