/* globals CommonError RollbackError */ // used in docs
import { DatabaseError } from './database-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'LocalRollbackError'
const defaultErrorType = 'a rollback error'
const myDefaults = { errorType : defaultErrorType }

/**
 * An {@link DatabaseError} sub-type relating to a failed rollback within a database. Use {@link RollbackError} on the
 * client side to indicate a failed rollback in an external data service.
 */
const LocalRollbackError = class extends DatabaseError {
  /**
   * {@link LocalRollbackError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.action = undefined] - A description of the action being taken. E.g., 'closing',
   *   'creating', etc.
   * @param {string} [options.errorType = 'a rollback error'] - A description of the error type.
   * @param {string|undefined} [options.issue = undefined] - Describes the specific issue.
   * @param {string} [options.target = 'database'] - The name or description of the target resource.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new LocalRollbackError() // "There an error in the database."
   * new LocalRollbackError({ action : 'updating' }) // "There was a rollback error updating the database."
   * new LocalRollbackError({ target : 'customer database' }) // "There was a rollback error in the customer database."
   * // v "There was a rollback error updating the customer database."
   * new LocalRollbackError({ action: 'updating', target : 'customer database' })
   * // v "There was a rollback error in the customer database; virtual socket closed."
   * new LocalRollbackError({ issue : 'virtual socket closed', target : 'customer database' })
   */
  constructor(
    { name = myName, errorType = defaultErrorType, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    super({ name, errorType, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(LocalRollbackError).name)

LocalRollbackError.typeName = myName

export { LocalRollbackError }
