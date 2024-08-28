/* globals RollbackError TransactionError */ // used in docs
import { CommonError } from './common-error'
import { includeParameterInMessage } from './lib/include-parameter-in-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'DatabaseError'
const defaultErrorType = 'an error'
const defaultTarget = 'database'
const myDefaults = { errorType : defaultErrorType, target : defaultTarget }

/**
 * Indicates a problem within a database system implementation.
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link RollbackError}
 * - {@link TransactionError}
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
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new DatabaseError() // "There an error in the database."
   * new DatabaseError({ action : 'syncing' }) // "There was an error syncing the database."
   * new DatabaseError({ target : 'customer database' }) // "There was an error in the customer database."
   * // v "There was an error creating the customer database."
   * new DatabaseError({ action: 'creating', target : 'customer database' })
   * // v "There was an error in the customer database; virtual socket closed."
   * new DatabaseError({ issue : 'virtual socket closed', target : 'customer database' })
   */
  constructor(
    {
      name = myName,
      errorType = defaultErrorType,
      target = defaultTarget,
      ...options
    } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message
      || generateMessage({ errorType, target, ...options }, defaults)
    super({ name, errorType, target, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(DatabaseError).name)

DatabaseError.typeName = myName

const generateMessage = (options, defaults) => {
  const { action, errorType, issue, target } = options

  let message = `There was ${includeParameterInMessage('errorType', options) ? errorType : defaults.errorType}`
  if (includeParameterInMessage('action', options)) {
    message += ' ' + action
  }
  else {
    message += ' in'
  }
  message += ` the ${includeParameterInMessage('target', options) ? target : defaults.target}`
  if (includeParameterInMessage('issue', options)) {
    message += `; ${issue}`
  }
  message += '.'

  return message
}

export { DatabaseError }
