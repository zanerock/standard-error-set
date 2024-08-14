import { ExternalServiceError } from './external-service-error'

const name = 'ConnectionError'

/**
 * An {@link ExternalServiceError} sub-type indicating a problem with the connection, including making a connection.
 */
const ConnectionError = class extends ExternalServiceError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

ConnectionError.typeName = name

export { ConnectionError }