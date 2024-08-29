/* globals CommonError ConnectionError ConstraintViolationError RollbackError TransactionError UniqueConstraintViolationError */ // used in docs
import { ExternalServiceError } from '../external-service-error'
import { generateExternalServiceMessage } from '../lib/generate-external-service-message'
import { registerParent } from '../../../settings/map-error-to-http-status'

const myName = 'DataServiceError'
const defaultService = 'data'
const myDefaults = { service : defaultService }

/**
 * An {@link ExternalServiceError} sub-type indicating a problem related to a data service specifically.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ConnectionError}
 * - {@link ConstraintViolationError}
 * - {@link RollbackError}
 * - {@link TransactionError}
 * - {@link UniqueConstraintViolationError}
 */
const DataServiceError = class extends ExternalServiceError {
  /**
   * {@link DataServiceError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.service = 'data'] - The name or short description of the service.
   * @param {string|undefined} [options.issue = undefined] - A description of the issue.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new DataServiceError() // There was an error with a remote data service.
   * new DataServiceError({ service : 'database' }) // The was an error with the remote database service.
   * // v "There was an error with a remote data service; service is not rot responding."
   * new DataServiceError({ issue : 'is not responding' })
   * // v "There was an error with the remote database service; service is not responding."
   * new DataServiceError({ service : 'database', issue : 'is not responding' })
   */
  constructor(
    { name = myName, service = defaultService, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message
      || generateExternalServiceMessage(
        undefined,
        { service, ...options },
        defaults
      )
    super({ name, service, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(DataServiceError).name)

DataServiceError.typeName = myName

export { DataServiceError }
