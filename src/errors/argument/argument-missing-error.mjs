/* globals ArgumentOutOfRangeError ArgumentTypeError CommonError */ // in the docs
import { ArgumentInvalidError } from './argument-invalid-error'
import { commonErrorSettings } from '../../settings/common-error-settings'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'ArgumentMissingError'
const defaultIssue = 'is missing or empty'
const myDefaults = { issue : defaultIssue }

/**
 * An {@link ArgumentInvalidError} sub-type indicating a argument is missing or empty which by default is interpreted
 * as a user supplied argument/input. See discussion on [setting and interpreting `InvalidArgumentError`
 * status](#setting-and-interpreting-invalidargumenterror-status) for more detail.
 *
 * <span id="argument-missing-error-custom-issue-logic"></span>
 * If using the class parameters to [construct the error message](#message-construction), where `issue` is not set and
 * `argumentValue` is specified, `ArgumentMissingError` determines the default `issue` based on the value of
 * `argumentValue`. The logic recognizes `null`, `undefined`, '' (the empty string), `{}` (empty object), and `[]` (
 * empty array). E.g., `argumentValue = null` yields issue `issue = "is 'null'"`.
 *
 * If your code has a different concept of what constitutes an "empty" argument, you'll need to specify the `issue`
 * parameter in the constructor options. E.g., `{ issue: "field 'foo' is not defined" }`.
 *
 * Since the argument value is implied in the issue and stating the value would be redundant, when the `issue` is
 * automatically customized and `ignoreForMessage` is not defined, the logic will set `ignoreForMessage =
 * ['argumentValue']` or merge `['argumentValue']` with any {@linkplain commonErrorSettings|globally configured
 * `ignoreForMessage` option}. To suppress this behavior, pass in an explicit `ignoreForMessage` (an empty array and
 * `undefined` are equivalent). If you want to be sure and maintain the global settings, set `ignoreForMessage` to
 * `commonErrorSettings('ignoreForMessage')`.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ArgumentInvalidError} - General argument error when no more specific error fits.
 * - {@link ArgumentOutOfRangeError} - Indicates an argument is of the correct type, but outside the acceptable range.
 * - {@link ArgumentTypeError} - Indicates an argument is an incorrect type.
 * @category Argument errors
 */
const ArgumentMissingError = class extends ArgumentInvalidError {
  /**
   * The {@link ArgumentMissingError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   {{< common-endpoint-parameters defaultEndpointType='command' }}
   * @param {string|undefined} [options.argumentName = undefined] - The argument name.
   * @param {string|undefined} [options.argumentType = undefined] - The argument type.
   * @param {*} [options.argumentValue] - The argument value. Because this is value is ignored when `undefined`,
   *   consider using the string 'undefined' if it's important to display the value.
   * @param {string} [options.issue = ('is missing or empty'\|<other>)] - The issue with the argument. The default
   *   value is determined by the value (or absence) of `argumentValue`. Refer to [discussion of customized issue
   *   logic](#argument-missing-error-custom-issue-logic) for details.
   {{> common-hidden-parameters }}
   * @example
   * new ArgumentInvalidError() // "Function argument is missing or empty."
   * //  "Function 'my-package#foo()' argument is missing or empty."
   * new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo()'})
   * //  "Function 'my-package#foo()' argument with value 'undefined' is missing or empty."
   * new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo()', argumentName: 'bar', argumentValue: 'undefined' })
   * // v "Function argument 'bar' is missing or empty."
   * new ArgumentInvalidError({ endpointType: 'function', argumentName: 'bar' })
   */
  constructor({ name = myName, issue, ...options } = {}, defaults) {
    defaults = Object.assign({}, myDefaults, defaults)
    // can't just use 'includeParameterInMessage' because we have our own logic regarding `issue` undefined
    const { ignoreForMessage = commonErrorSettings('ignoreForMessage') || [] } =
      options
    const ignoreIssue =
      ignoreForMessage.includes('issue') || ignoreForMessage.includes('all')
    // if user explicitly sets 'issue' 'undefined', then we fall through to using the default issue message
    if (
      issue === undefined
      && !Object.hasOwn(options, 'issue')
      && ignoreIssue === false
    ) {
      if (Object.hasOwn(options, 'argumentValue')) {
        const value = options.argumentValue
        options.issue =
          value === undefined
            ? "is 'undefined'"
            : value === null
              ? "is 'null'"
              : value === ''
                ? "is the empty string ('')"
                : Array.isArray(value) && value.length === 0
                  ? "is an empty array ('[]')"
                  : typeof value === 'object' && Object.keys(value).length === 0
                    ? "is an empty object ('{}')"
                    : defaultIssue
        if (
          options.issue !== defaultIssue
          && options.ignoreForMessage === undefined
        ) {
          // If user hasn't specified ignoreForMessage, then we default to ignoring argumentValue, which is now
          // redundant.
          const globalIgnoreForMessage =
            commonErrorSettings('ignoreForMessage') || []
          options.ignoreForMessage = [
            'argumentValue',
            ...globalIgnoreForMessage,
          ]
        }
      }
    }
    issue = issue || defaultIssue
    super({ name, issue, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentMissingError).name)

ArgumentMissingError.typeName = myName

export { ArgumentMissingError }
