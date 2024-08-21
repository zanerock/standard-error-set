/* globals CommonError */
import { ExternalServiceError } from './external-service-error'
import { connectionCodes } from './lib/connection-codes'
import { hoistErrorCode } from './lib/hoist-error-code'
import { registerParent } from './map-error-to-http-status'

const myName = 'ConnectionError'

/**
 * An {@link ExternalServiceError} sub-type indicating a problem with a connection, including making a connection. The
 * standard instance `message` is determined by the `code` instance field, which indicates the specific nature of the
 * connection error. Recall that due to [error code hoisting](#error-code-hoisting), the `code` of the `cause` `Error`
 * will set the `ConnectionError` `code` (unless the constructor options `code` is set or `noHoistCode` is `true`) and
 * the hoisted `code` will determine the standard message (unless the `message` option is defined).
 */
const ConnectionError = class extends ExternalServiceError {
  /**
   * Constructor for the {@link ConnectionError} class.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.issue = _variaus_] - Typically left `undefined` and determined automatically according to 
   *   the error `code`. Describes the specific issue.
   * @param {string|undefined} [options.target = undefined] - The name or description of the connection target.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
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
  constructor({ name = myName, ...options } = {}) {
    hoistErrorCode(options) // hoist the code prior to generating message
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ConnectionError).name)

ConnectionError.typeName = myName

const generateMessage = ({ code, issue, target }) => {
  issue = issue || connectionCodes[code] || 'experienced an unknown error'

  return `Connection ${target === undefined ? '' : `${target} `}${issue}.`
}

export { ConnectionError }
