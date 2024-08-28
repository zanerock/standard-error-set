/* globals ConstraintViolationError DataServiceError RollbackError TransactionError UniqueConstraintViolationError */
import { CommonError } from './common-error'
import { generateExternalServiceMessage } from './lib/generate-external-service-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'ExternalServiceError'
const defaultService = ''
const myDefaults = { service: defaultService }

/**
 * Indicates an error related to an external service.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ConstraintViolationError}
 * - {@link DataServiceError}
 * - {@link RollbackError}
 * - {@link TransactionError}
 * - {@link UniqueConstraintViolationError}
 */
const ExternalServiceError = class extends CommonError {
  /**
   * {@link ExternalServiceError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.service = ''] - The name or short description of the service.
   * @param {string|undefined} [options.issue = undefined] - A description of the issue.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new ExternalServiceError() // There was an error with a remote service.
   * new ExternalServiceError({ service : 'Foo API' }) // The was an error with the Foo API remote service.
   * // v "A remote service is not responding."
   * new ExternalServiceError({ issue : 'is not responding' })
   * // v "The remote service Foo API is not responding."
   * new ExternalServiceError({ service : 'Foo API', issue : 'is not responding' })
   */
  constructor({ name = myName, service = '', ...options } = {}, defaults) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message ||
      generateExternalServiceMessage(
        undefined,
        { service, ...options },
        defaults
      )
    super({ name, service, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(ExternalServiceError).name)

ExternalServiceError.typeName = myName

export { ExternalServiceError }
