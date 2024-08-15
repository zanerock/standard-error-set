/* globals ArgumentMissingError ConstraintViolationError UniqueConstraintViolationError */
import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'ArgumentInvalidError'

/**
 * Indicates an invalid argument was passed to a function.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ArgumentMissingError} - Consider this when the argument is required, but missing or empty.
 * - {@link ConstraintViolationError} - Consider this when the argument is of the proper type, but violates some
 *   constraint.
 * - {@link UniqueConstraintViolationError} - Consider this when the argument is of the proper type, but violates a
 *   unique constraint.
 */
const ArgumentInvalidError = class extends CommonError {
  /**
   * The {@link ArgumentInvalidError} constructor.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} options - The error options.
   * @param {string|undefined} options.packageName - The package name (optional).
   * @param {string|undefined} options.functionName - The function name (optional).
   * @param {string|undefined} options.argumentName - The argument name (optional).
   * @param {string|undefined} options.argumentValue - The argument value (optional).
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * new ArgumentInvalidError() // "Function argument has invalid value."
   * // v yields: "Function 'my-package#foo()' argument  has invalid value."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo'})
   * // v yields: "Function 'my-package#foo()' argument 'bar' has invalid value '100'."
   * new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 100 })
   */
  constructor ({ name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(options)

    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentInvalidError).name)

ArgumentInvalidError.typeName = myName

const generateMessage = ({ packageName, functionName, argumentName, argumentValue }) => {
  let message = 'Function '
  if (packageName !== undefined) {
    message += functionName === undefined ? `in package '${packageName}' ` : `'${packageName}#`
  }
  if (functionName !== undefined) {
    message += `${packageName === undefined ? "'" : ''}${functionName}()' `
  }
  message += 'argument '
  if (argumentName !== undefined) {
    message += `'${argumentName}' `
  }
  message += 'has invalid value'
  if (argumentValue !== undefined) {
    try {
      const valueString = typeof argumentValue === 'object' ? JSON.stringify(argumentValue) : argumentValue
      message += ` '${valueString}'.`
    } catch (e) {
      message += '.'
    }
  } else {
    message += '.'
  }
  return message
}

export { ArgumentInvalidError }
