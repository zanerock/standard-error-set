/* globals CommonError TransactionError */ // used in docs
import { IoError } from './io-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'LocalTransactionError'

/**
 * An {@link IoError} indicating a problem creating or otherwise involving a transaction within a database system
 * itself. Use {@link TransactionError} for transaction errors related to transactions in an external database service.
 */
const LocalTransactionError = class extends IoError {
  /**
   * {@link LocalTransactionError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.action = undefined] - A description of the action being taken. E.g., 'closing', 
   *   'creating', etc.
   * @param {string|undefined} [options.issue = undefined] - Describes the specific issue.
   * @param {string|undefined} [options.target = undefined] - The name or description of the target resource.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new LocalTransactionError() // "There was a transaction error."
   * new LocalTransactionError({ action : 'closing' }) // There was an error closing the transaction.
   * // v "There was a transaction error on the customer database."
   * new LocalTransactionError({ target : 'customer database' })
   * // v "There was an error closing the transaction on the customer database."
   * new LocalTransactionError({ action: 'creating', target : 'customer database' })
   * // v "There was a transaction error on the customer database; virtual socket closed."
   * new LocalTransactionError({ issue : 'virtual socket closed', target : 'customer database' })
   */
  constructor({ name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(LocalTransactionError).name)

LocalTransactionError.typeName = myName

const generateMessage = ({ action, issue, target }) => {
  let message = 'There was'
  if (action === undefined) {
    message += ' a transaction error'
  }
  else {
    message += ` an error ${action} the transaction`
  }
  if (target !== undefined) {
    message += ` on the ${target}`
  }
  if (issue !== undefined) {
    message += `; ${issue}`
  }
  message += '.'

  return message
}

export { LocalTransactionError }
