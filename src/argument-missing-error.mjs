import { ArgumentInvalidError } from './argument-invalid-error'
import { generateBadArgumentMessage } from './lib/generate-bad-argument-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'ArgumentMissingError'

/**
 * A {@link ArgumentInvalidError} sub-type indicating an argument is missing or empty (typically `null', `undefined`,
 * or '').
 * 
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ArgumentMissingError} - Consider this when the argument is required, but missing or empty.
 * - {@link ConstraintViolationError} - Consider this when the argument is of the proper type, but violates some
 *   constraint.
 * - {@link UniqueConstraintViolationError} - Consider this when the argument is of the proper type, but violates a
 *   unique constraint.
 */
const ArgumentMissingError = class extends ArgumentInvalidError {
  /**
   * The {@link ArgumentMissingError} constructor.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} options - The error options.
   * @param {string|undefined} options.packageName - The package name (optional).
   * @param {string|undefined} options.functionName - The function name (optional).
   * @param {string|undefined} options.argumentName - The argument name (optional).
   * @param {string|undefined} options.argumentValue - The argument value (optional). Because this is value is ignored 
   *   when `undefined`, consider using the string 'undefined' if it's important to display the value.
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
  constructor ({ name = myName, ...options }) {
    options.message = options.message || generateBadArgumentMessage('is missing or empty', 'with value', options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentMissingError).name)

ArgumentMissingError.typeName = myName

export { ArgumentMissingError }
