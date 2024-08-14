import { ExternalServiceError } from './external-service-error'

const name = 'ExternalServiceError'

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
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

DataServiceError.typeName = name

export { DataServiceError }