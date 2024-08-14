import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'InvalidArgumentError'

/**
 * Indicates an invalid argument was passed to a function.
 * 
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link EmptyArgumentError} - Consider this when the argument is required, but missing or empty.
 * - {@link ConstraintViolationError} - Consider this when the argument is of the proper type, but violates some 
 *   constraint.
 * - {@link UniqueConstraintViolationError} - Consider this when the argument is of the proper type, but violates a 
 *   unique constraint.
 */
const InvalidArgumentError = class extends CommonError {
  /**
   * The {@link InvalidArgumentError} constructor.
   * @example <caption>No arg constructor yields: "Function argument has invalid value."</caption>
   * new InvalidArgumentError()
   * @example <caption>Partial spec by positional args, yields: "Function 'my-package#foo()' argument  has invalid value."</caption>
   * new InvalidArgumentError({ packageName: 'my-package', functionName: 'foo'})
   * @example <caption>Full spec yields: "Function 'my-package#foo()' argument 'bar' has invalid value '100'."</caption>
   * new InvalidArgumentError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 100 })
   * @param {object} options - The error options.`
   * @param {string|undefined} options.packageName - The package name (optional).
   * @param {string|undefined} options.functionName - The function name (optional).
   * @param {string|undefined} options.argumentName - The argument name (optional).
   * @param {string|undefined} options.argumentValue - The argument value (optional).
   * @param {string|undefined} options.message - If not undefined, then the `message` value will used as the error
   *   message instead of a generated error message.
   * @param options.name
   * @param {number|undefined} options.status - If defined, overrides the default HTTP status code assignment for this
   *   `Error` instance.
   * @param {Error|undefined} options.cause - The underlying error, if any, which caused this error. Typically used
   *   when wrapping a more generic error with a more specific error or connecting errors across error boundaries
   *   (e.g., across asynchronous calls).
   * @param {object|undefined} options.options - The remainder of the options to to pass to `Error`.
   */
  constructor ({ packageName, functionName, argumentName, argumentValue, name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(packageName, functionName, argumentName, argumentValue)

    super({ name, ...options })

    this.packageName = packageName
    this.functionName = functionName
    this.argumentName = argumentName
    this.argumentValue = argumentName
  }
}

registerParent(myName, Object.getPrototypeOf(InvalidArgumentError).name)

InvalidArgumentError.typeName = myName

const generateMessage = (packageName, functionName, argumentName, argumentValue) => {
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

export { InvalidArgumentError }
