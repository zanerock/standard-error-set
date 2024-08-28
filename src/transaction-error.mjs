/* global CommonError ConnectionError ConstraintViolationError LocalTransactionError RollbackError UniqueConstraintViolationError */ // used in documentation
import { DataServiceError } from './data-service-error'
import { generateExternalServiceMessage } from './lib/generate-external-service-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'TransactionError'
const defaultService = 'data'
const myDefaults = { service : defaultService }

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
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.service = undefined] - The name or short description of the service.
   * @param {string|undefined} [options.issue = undefined] - A description of the issue.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new TransactionError() // There was a transaction error with the remote data service.
   * new TransactionError({ service : 'database' }) // There was a transaction error with the remote database service.
   * // v "There was a transaction error with the remote data service; service is not responding."
   * new TransactionError({ issue : 'is not responding' })
   * // v "There was a transaction error with the remote database service; service is not responding."
   * new TransactionError({ service : 'database', issue : 'is not responding' })
   */
  constructor({ name = myName, service = defaultService, ...options } = {}, defaults) {
    // DEBUG
    const foo =
    'This is the value of foo!'
    const bar =
      'blah blah blah blah'
    console.log(foo, bar)
    // GUBED
    defaults = Object.assign({}, myDefaults, defaults)
    options.message = options.message
    || generateExternalServiceMessage('a transaction', { service, ...options }, defaults)
    super({ name, service, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(TransactionError).name)

TransactionError.typeName = myName

export { TransactionError }
