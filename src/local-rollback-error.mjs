/* globals CommonError RollbackError */ // used in docs
import { IoError } from './io-error'
import { generateIoErrorMessage } from './lib/generate-io-error-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'LocalRollbackError'

/**
 * An {@link IoError} sub-type relating to a failed rollback within a database. Use {@link RollbackError} on the client
 * side to indicate a failed rollback in an external data service.
 */
const LocalRollbackError = class extends IoError {
  /**
   * {@link LocalRollbackError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} options.action - A description of the action being taken. Defaults to 'rolling back'.
   * @param {string|undefined} options.issue - Describes the specific issue.
   * @param {string|undefined} options.target - The name or description of the target resource.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new LocalRollbackError() // "There was an error rollback error."
   * new LocalRollbackError({ action : 'attempting rollback' }) // "There was an error while attempting rolling."
   * // v "There was an while rolling back the customer database."
   * new LocalRollbackError({ target : 'customer database' })
   * // v "There was an error while attempting distributed rollback of the customer database."
   * new LocalRollbackError({ action: 'attempting distributed rollback of', target : 'customer database' })
   * // v "There was an error rolling back the customer database; virtual socket closed."
   * new LocalRollbackError({ issue : 'virtual socket closed', target : 'customer database' })
   */
  constructor({ name = myName, ...options } = {}) {
    options.action = options.action || 'rolling back'
    options.message = options.message || generateIoErrorMessage('an', options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(LocalRollbackError).name)

LocalRollbackError.typeName = myName

export { LocalRollbackError }
