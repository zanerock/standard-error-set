import { CommonError } from './common-error'

const name = 'InvalidArgumentError'

/**
 * The arguments option for `InvalidArgumentError`. These options are also passed to the `Error` constructor, which may
 * recognize additional options.
 * @typedef InvalidArgumentOptions
 * @property {string} functionName - The name of the function to use in any generated message.
 */

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
   * new InvalidArgumentError('my-package', 'foo')
   * @example <caption>Partial spec by options, yields: "Function 'my-package#foo()' argument has invalid value."</caption>
   * new InvalidArgumentError({ packageName: 'my-package', functionName: 'foo'})
   * @example <caption>Full spec yields: "Function 'my-package#foo()' argument 'bar' has invalid value '100'."</caption>
   * new InvalidArgumentError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 100 })
   * @param {string|InvalidArgumentOptions|undefined} packageNameOrOptions - The package name, a
   *   [`InvalidArgumentOptions`](#InvalidArgumentOptions) object, or undefined (which will omit the package name from
   *   the message unless specified in a final options argument).
   * @param {string|InvalidArgumentOptions|undefined} functionNameOrOptions - The function name, a
   *   [`InvalidArgumentOptions`](#InvalidArgumentOptions) object, or undefined (which will omit the function name from
   *   the message unless specified in a final options argument).
   * @param {string|InvalidArgumentOptions|undefined} argumentNameOrOptions - The argument name, a
   *   [`InvalidArgumentOptions`](#InvalidArgumentOptions) object, or undefined (which will omit the argument name from
   * @param {string|InvalidArgumentOptions|undefined} argumentValueOrOptions - The argument value, a
   *   [`InvalidArgumentOptions`](#InvalidArgumentOptions) object, or undefined (which will omit the argument value
   *   from the message unless specified in a final options argument). If the value is an `Object`, you must provide a
   *   final `options` argument, which may be `{}`, `null`, but not `undefined`. See function documentation for
   *   treatment of `Object` values in any generated message.
   * @param {InvalidArgumentOptions|undefined} options - The final options `Object`, if any, which is passed to the
   *   `Error` super-constructor and whose values can override the positional arguments.
   */
  constructor (packageNameOrOptions, functionNameOrOptions, argumentNameOrOptions, argumentValueOrOptions, options) {
    const effectiveOptions = {}
    if (typeof packageNameOrOptions === 'string') {
      effectiveOptions.packageName = packageNameOrOptions
    }
    if (typeof functionNameOrOptions === 'string') {
      effectiveOptions.functionName = functionNameOrOptions
    }
    if (typeof argumentNameOrOptions === 'string') {
      effectiveOptions.argumentName = argumentNameOrOptions
    }
    if (typeof argumentValueOrOptions !== 'object' || options !== undefined) {
      effectiveOptions.argumentValue = argumentValueOrOptions
    }
    options = arguments[arguments.length - 1] || {}
    if (typeof options !== 'object') {
      options = {}
    }
    Object.assign(effectiveOptions, options)

    const message = generateMessage(effectiveOptions)

    super(name, message, effectiveOptions)

    this.packageName = effectiveOptions.packageName
    this.functionName = effectiveOptions.functionName
    this.argumentName = effectiveOptions.argumentName
    this.argumentValue = effectiveOptions.argumentName
  }
}

InvalidArgumentError.typeName = name

const generateMessage = ({ packageName, functionName, argumentName, argumentValue, message }) => {
  if (message !== undefined) {
    return message
  }
  message = 'Function '
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
