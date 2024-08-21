/* globals CommonError ConnectionError ConstraintViolationError RollbackError TransactionError UniqueConstraintViolationError */ // used in docs
import { ExternalServiceError } from './external-service-error'
import { generateExternalServiceMessage } from './lib/generate-external-service-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'DataServiceError'

/**
 * An {@link ExternalServiceError} sub-type indicating a problem related to a data service specifically.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ConnectionError}
 * - {@link ConstraintViolationError}
 * - {@link RollbackError}
 * - {@link TransactionError}
 * - {@link UniqueConstraintViolationError}
 */
const DataServiceError = class extends ExternalServiceError {
  /**
   * {@link DataServiceError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} options.service - The name or short description of the service.
   * @param {string|undefined} options.issue - A description of the issue.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new DataServiceError() // There was an error with a remote data service.
   * new DataServiceError({ service : 'database' }) // The was an error with the database remote data service.
   * // v "There was an error with a remote data service; service is not rot responding.""
   * new DataServiceError({ issue : 'is not responding' })
   * // v "There was an error with the database remote data service; service is not rot responding.""
   * new DataServiceError({ service : 'database', issue : 'is not responding' })
   */
  constructor({ name = myName, ...options } = {}) {
    options.message = options.message || generateExternalServiceMessage('data', undefined, options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(DataServiceError).name)

DataServiceError.typeName = myName

export { DataServiceError }
