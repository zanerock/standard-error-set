/* global CommonError ConnectionError ConstraintViolationError RollbackError RollbackError UniqueConstraintViolationError */ // used in documentation
import { DatabaseError } from './database-error'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'TransactionError'
const defaultErrorType = 'a transaction error'
const myDefaults = { errorType : defaultErrorType }

/**
 * An {@link DatabaseError} indicating a problem creating or otherwise involving a transaction within a database system
 * itself. Use {@link TransactionError} for transaction errors related to transactions in an external database service.
 * Refer to {@link DatabaseError} for [remote vs local database
 * errors](#database-error-remote-vs-local-database-errors).
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ConnectionError}
 * - {@link ConstraintViolationError}
 * - {@link DatabaseError}
 * - {@link RollbackError}
 * - {@link UniqueConstraintViolationError}
 * @category Database errors
 */
const TransactionError = class extends DatabaseError {
  /**
   * {@link TransactionError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.action = undefined] - A description of the action being taken. E.g., 'closing',
   *   'creating', etc.
   * @param {string} [options.errorType = 'an error'] - A description of the error type.
   * @param {string|undefined} [options.issue = undefined] - Describes the specific issue.
   * @param {string} [options.target = 'database'] - The name or description of the target resource.
   * @param {boolean} [options.isLocal = false] - Indicates whether the error arises from a remote database or not.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   {{> common-hidden-parameters }}
   * @example
   * new TransactionError() // "There was a transaction error in the database."
   * new TransactionError({ action : 'closing' }) // "There was an error closing the transaction."
   * // v "There was a transaction error on the customer database."
   * new TransactionError({ target : 'customer database' })
   * // v "There was an error closing the transaction on the customer database."
   * new TransactionError({ action: 'creating', target : 'customer database' })
   * // v "There was a transaction error on the customer database; virtual socket closed."
   * new TransactionError({ issue : 'virtual socket closed', target : 'customer database' })
   */
  constructor(
    { name = myName, errorType = defaultErrorType, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    super({ name, errorType, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(TransactionError).name)

TransactionError.typeName = myName

export { TransactionError }
