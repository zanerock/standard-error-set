/* globals CommonError */
import { ExternalServiceError } from './external-service-error'
import { hoistErrorCode } from './lib/hoist-error-code'
import { registerParent } from './map-error-to-http-status'

const myName = 'ConnectionError'

/**
 * An {@link ExternalServiceError} sub-type indicating a problem with a connection, including making a connection. The
 * standard instance `message` is determined by the `code` instance field, which indicates the specific nature of the
 * connection error. Recall that due to [error code hoisting](#error-code-hoisting), the `code` of the `cause` `Error`
 * will set the `ConnectionError` `code` (unless the constructor options `code` is set or `noHoistCode` is `true`) and
 * the hoisted `code` will determine the standard message (unless the `message` option is defined).`
 */
const ConnectionError = class extends ExternalServiceError {
  /**
   * Constructor for the {@link ConnectionError} class.
   * @param {object} options - The constructor options.
   * @param {string|undefined} options.issue - Typically left `undefined` and determined automatically. Describes the
   *   specific issue.`
   * @param {string|undefined} options.target - The name or description of the connection target.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
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
  constructor ({ name = myName, ...options } = {}) {
    hoistErrorCode(options) // hoist the code prior to generating message
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ConnectionError).name)

ConnectionError.typeName = myName

const generateMessage = ({ code, issue, target }) => {
  if (issue === undefined) {
    switch (code) {
      case ('ECONNRESET') :
        issue = 'has been reset'; break
      case ('ENOTFOUND') :
        issue = 'host not found; check for typos'; break
      case ('ETIMEDOUT') :
        issue = 'request timed out'; break
      case ('ECONNREFUSED') :
        issue = 'refused; check port and ensure target service is running'; break
      case ('ERRADDRINUSE') :
        issue = 'port already bound; verify port and check for duplicate or conflicting service'; break
      case ('EADDRNOTAVAIL') :
        issue = 'address not available; verify binding IP address correct and exists or try binding to 0.0.0.0'; break
      case (' ECONNABORTED') :
        issue = "connection prematurely aborted; this is possibly due to 'result.end()' being called before 'result.sendFile()' could complete"; break
      case ('EHOSTUNREACH') :
        issue = 'host unreachable; check local routing configuration and target and intermediate firewalls'; break
      case ('EAI_AGAIN') :
        issue = 'host name cannot be resolved due to temporary DNS resolution issue; verify internet connection is stable and check DNS resolution settings (/etc/resolv.conf and /etc/hosts)'; break
      default:
        issue = 'experienced an unknown error'
    }
  }

  return `Connection ${target === undefined ? '' : `${target} `}${issue}.`
}

export { ConnectionError }
