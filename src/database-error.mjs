/* globals CommonError TransactionError */ // used in docs
import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'DatabaseError'

/**
 * Indicates a problem within a database system implementation.
 */
const DatabaseError = class extends CommonError {
  /**
   * {@link DatabaseError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.action = undefined] - A description of the action being taken. E.g., 'closing',
   *   'creating', etc.
   * @param {string} [options.errorType = 'an error'] - A description of the error type.
   * @param {string|undefined} [options.issue = undefined] - Describes the specific issue.
   * @param {string} [options.target = 'target'] - The name or description of the target resource.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new DatabaseError() // "There an error in the database."
   * new DatabaseError({ action : 'syncing' }) // "There was an error syncing the database."
   * new DatabaseError({ target : 'customer database' }) // "There was an error in the customer database."
   * // v "There was an error creating the customer database."
   * new DatabaseError({ action: 'creating', target : 'customer database' })
   * // v "There was an error in the customer database; virtual socket closed."
   * new DatabaseError({ issue : 'virtual socket closed', target : 'customer database' })
   */
  constructor({ name = myName, errorType = 'an error', target = 'database', ...options } = {}) {
    options.message = options.message || generateMessage({ errorType, target, ...options})
    super({ name, errorType, target, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(DatabaseError).name)

DatabaseError.typeName = myName

const generateMessage = ({ action, errorType, issue, target }) => {
  let message = `There was ${errorType}`
  if (action !== undefined) {
    message += ' ' + action
  }
  else {
    message += ' in'
  }
  message += ` the ${target}`
  if (issue !== undefined) {
    message += `; ${issue}`
  }
  message += '.'

  return message
}

export { DatabaseError }
