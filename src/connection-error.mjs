import { ExternalServiceError } from './external-service-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'ConnectionError'

/**
 * An {@link ExternalServiceError} sub-type indicating a problem with the connection, including making a connection.
 */
const ConnectionError = class extends ExternalServiceError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ConnectionError).name)

ConnectionError.typeName = myName

export { ConnectionError }
