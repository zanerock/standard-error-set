/* globals CommonError TimeoutError */
import { ExternalServiceError } from './external-service-error'
import { connectionCodes } from './lib/connection-codes'
import { hoistErrorCode } from '../lib/hoist-error-code'
import { includeParameterInMessage } from '../../util/include-parameter-in-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'ConnectionError'
const defaultIssue = 'experienced an unknown error'

/**
 * An {@link ExternalServiceError} sub-type indicating a problem with a connection, including making a connection. The
 * standard instance `message` is determined by the `code` instance field, which indicates the specific nature of the
 * connection error. Recall that due to [error code hoisting](#error-code-hoisting), the `code` of the `cause` `Error`
 * will set the `ConnectionError` `code` (unless the constructor options `code` is set or `noHoistCode` is `true`) and
 * the hoisted `code` will determine the standard message (unless the `message` option is defined).
 *
 * Consider using {@link TimeoutError} when the problem is specifically a connection timeout.
 * @category External service errors
 */
const ConnectionError = class extends ExternalServiceError {
  /**
   * Constructor for the {@link ConnectionError} class.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.issue = _variaus_] - Typically left `undefined` and determined automatically according to
   *   the error `code`. Describes the specific issue.
   * @param {string|undefined} [options.target = undefined] - The name or description of the connection target.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new ConnectionError() // "Connection has experienced an unknown error."
   * // v "Connection to host 'foo.com' has experienced an unknown error."
   * new ConnectionError({ target: "to host 'foo.com'" })
   * // v "Connection to host 'foo.com' is blocked by system firewall."
   * new ConnectionError({ target: "to host 'foo.com'", issue: 'is blocked by system firewall' })
   * new ConnectionError({ code: 'ECONNRESET' }) // "Connection has been reset."
   * const cause = new Error()
   * const cause.code = 'ECONNRESET'
   * const connError = new ConnectionError({ cause }) // also "Connection has been reset."
   */
  constructor({ name = myName, issue, ...options } = {}, defaults) {
    const { code } = options // leave 'code' in the options for hoistErrorCode
    issue = issue || connectionCodes[code] || defaultIssue
    defaults = Object.assign(
      {},
      { issue : connectionCodes[code] || defaultIssue },
      defaults
    )
    hoistErrorCode(options) // hoist the code prior to generating message
    options.message =
      options.message || generateMessage({ issue, ...options }, defaults)
    super({ name, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(ConnectionError).name)

ConnectionError.typeName = myName

const generateMessage = (options, defaults) => {
  const { issue, target } = options

  return `Connection ${includeParameterInMessage('target', options) ? `${target} ` : ''}${includeParameterInMessage('issue', options) ? issue : defaults.issue}.`
}

export { ConnectionError }
