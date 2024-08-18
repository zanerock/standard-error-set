/* global CommonError ConnectionError ConstraintViolationError LocalTransactionError RollbackError UniqueConstraintViolationError */ // used in documentation
import { DataServiceError } from './data-service-error'
import { generateExternalServiceMessage } from './lib/generate-external-service-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'TransactionError'

/**
 * A {@link DataServiceError} sub-type indicating a problem with creating or working with a transaction. Note, this
 * error is specifically for problems arising with an external data service; use {@link LocalTransactionError} for
 * error or otherwise involving a transaction within a database system itself.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ConnectionError}
 * - {@link ConstraintViolationError}
 * - {@link DataServiceError}
 * - {@link RollbackError}
 * - {@link UniqueConstraintViolationError}
 */
const TransactionError = class extends DataServiceError {
  /**
   * {@link TransactionError} constructor.
   * @param {object|undefined} options - Constructor options.
   * @param {string|undefined} options.service - The name or short description of the service.
   * @param {string|undefined} options.issue - A description of the issue.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * new TransactionError() // There was an error with a remote data service.
   * new TransactionError({ service : 'database' }) // The was an error with the database remote data service.
   * // v "There was an error with a remote data service; service is not rot responding.""
   * new TransactionError({ issue : 'is not responding' })
   * // v "There was an error with the database remote data service; service is not rot responding.""
   * new TransactionError({ service : 'database', issue : 'is not responding' })
   */
  constructor ({ name = myName, ...options } = {}) {
    options.message = options.message || generateExternalServiceMessage('data', 'a transaction', options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(TransactionError).name)

TransactionError.typeName = myName

export { TransactionError }
