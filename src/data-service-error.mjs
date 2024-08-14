import { ExternalServiceError } from './external-service-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'DataServiceError'

/**
 * An {@link ExternalServiceError} sub-type indicating a problem related to a data service specifically. Consider
 * whether any of the following errors might be more precise or better suited:
 * - {@link ConnectionError}
 * - {@link ConstraintViolation}
 * - {@link RollbackError}
 * - {@link TransactionError}
 * - {@link UniqueConstraintViolation}
 */
const DataServiceError = class extends ExternalServiceError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(DataServiceError).name)

DataServiceError.typeName = myName

export { DataServiceError }
