/* globals CommonError TransactionError */ // used in docs
import { DatabaseError } from './database-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'LocalTransactionError'

/**
 * An {@link IoError} indicating a problem creating or otherwise involving a transaction within a database system
 * itself. Use {@link TransactionError} for transaction errors related to transactions in an external database service.
 */
const LocalTransactionError = class extends DatabaseError {
  /**
   * {@link LocalTransactionError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.action = undefined] - A description of the action being taken. E.g., 'closing',
   *   'creating', etc.
   * @param {string} [options.errorType = 'an error'] - A description of the error type.
   * @param {string|undefined} [options.issue = undefined] - Describes the specific issue.
   * @param {string} [options.target = 'database'] - The name or description of the target resource.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new LocalTransactionError() // "There was a transaction error."
   * new LocalTransactionError({ action : 'closing' }) // "There was an error closing the transaction."
   * // v "There was a transaction error on the customer database."
   * new LocalTransactionError({ target : 'customer database' })
   * // v "There was an error closing the transaction on the customer database."
   * new LocalTransactionError({ action: 'creating', target : 'customer database' })
   * // v "There was a transaction error on the customer database; virtual socket closed."
   * new LocalTransactionError({ issue : 'virtual socket closed', target : 'customer database' })
   */
  constructor({ name = myName, errorType = 'a transaction error', ...options } = {}) {
    super({ name, errorType, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(LocalTransactionError).name)

LocalTransactionError.typeName = myName

export { LocalTransactionError }
