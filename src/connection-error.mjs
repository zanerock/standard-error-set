import { ExternalServiceError } from './external-service-error'
import { generateConnectionMessage } from './lib/generate-connection-message'
import { hoistErrorCode } from './lib/hoist-error-code'
import { registerParent } from './map-error-to-http-status'

const myName = 'ConnectionError'

/**
 * An {@link ExternalServiceError} sub-type indicating a problem with a connection, including making a connection. The 
 * standard instance `message` is determined by the `code` instance field, which indicates the specific nature of the 
 * connection error.
 */
const ConnectionError = class extends ExternalServiceError {
  /**
   * Constructor for the {@link ConnectionResetError} class.
   * @param {object} options - The constructor options.
   * @param {string|undefined} options.target - The name or description of the connection target.
   */
  constructor ({ name = myName, ...options } = {}) {
    hoistErrorCode(options)
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
    case ('ERRADDRINUSE') :
      issue = 'address not available; verify binding IP address correct and exists or try binding to 0.0.0.0'; break
    case (' ECONNABORTED') :
      issue = "connection prematurely aborted; this is possibly due to 'result.end()' being called before 'result.sendFile()' could complete"; break
    case ('EHOSTUNREACH') :
      issue = 'host unreachable; check local routing configuration and target and intermediate firewalls'; break
    case ('EAI_AGAIN') :
      issue = 'host name cannot be resolved due to temporary DNS resolution issue; verify internet connection is stable and check DNS resolution settings (/etc/resolv.conf and /etc/hosts)'
    }

    issue = 'experienced an unknown error' // default


  let message = `Connection ${target === undefined ? '' : `${target} `} ${issue}.`
}

export { generateConnectionMessage }

export { ConnectionError }
