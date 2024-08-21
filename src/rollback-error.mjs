/* global CommonError ConnectionError ConstraintViolationError LocalRollbackError TransactionError UniqueConstraintViolationError */ // used in documentation
import { DataServiceError } from './data-service-error'
import { generateExternalServiceMessage } from './lib/generate-external-service-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'RollbackError'

/**
 * A {@link DataServiceError} relating to a failed rollback attempt on an external data service. Use {@link
 * LocalRollbackError} within a database implementation itself.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ConnectionError}
 * - {@link ConstraintViolationError}
 * - {@link DataServiceError}
 * - {@link LocalRollbackError}
 * - {@link TransactionError}
 * - {@link UniqueConstraintViolationError}
 */
const RollbackError = class extends DataServiceError {
  /**
   * {@link RollbackError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} options.service - The name or short description of the service.
   * @param {string|undefined} options.issue - A description of the issue.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * new RollbackError() // There was an rollback error with a remote data service.
   * new RollbackError({ service : 'database' }) // The was an rollback error with the database remote data service.
   * // v "There was a rollback error with a remote data service; service is not rot responding.""
   * new RollbackError({ issue : 'is not responding' })
   * // v "There was a rollback error with the database remote data service; service is not rot responding.""
   * new RollbackError({ service : 'database', issue : 'is not responding' })
   */
  constructor({ name = myName, ...options } = {}) {
    options.message = options.message || generateExternalServiceMessage('data', 'a rollback', options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(RollbackError).name)

RollbackError.typeName = myName

export { RollbackError }
