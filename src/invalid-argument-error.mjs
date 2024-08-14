import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'InvalidArgumentError'

/**
 * Indicates an invalid argument was passed to a function. In general, the easiest way to invoke the constructor is
 * with a single [`InvalidArgumentOptions`](#InvalidArgumentOptions} option object. The constructor can also be called
 * with either positional arguments for the function package, function name, argument name, and argument value (in that
 * order, each optional). In any case, if the final argument is an `Object`, it is treated as an options argument and
 * the options argument is passed to the `Error` super-constructor (e.g., this is where you would set `cause`, if any).
 * Finally, if `message` is set directly in the options argument, it will be used  regardless of the presence of other
 * option fields or positional arguments.
 *
 * When the argument value is specified, either with positional arguments or as an options field, it will be reported
 * in the message, if possible. If the value is an `Object`, it will be stringified with `JSON.stringify`. If that is
 * not possible, then the resulting error message will omit reporting the value and treat the argument value as
 * `undefined` for the purposes of creating the message. The argument value will still be available in the `
 *  argumentValue` field on the `InvalidArgumentError` instance.`
 *
 * When both a positional argument and the corresponding options argument are both set, (e.g., `functionNameOrOptions'
 * and `options.functionName`), the options field will win out. Also, because if the last argument is treated as the
 * options argument, you must explicitly set `options` (either `{}` or `null`) if `argumentValueOrOptions` is itself an
 * object. Otherwise, `argumentValueOrOptions` will be treated as the options argument (and not the argument value) if
 * `options` is unset or explicitly undefined.
 *
 * If specified, in either positional arguments, or option fields, `packageName`, `funcitonName`, `argumentName`, and
 * `argumentValue` will be available as fields on the `InvalidArgumentError` instance.
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
