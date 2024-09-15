/* globals ConnectionError DatabaseError UnavailableError TimeoutError */ // used in docs
import { CommonError } from '../common-error'
import { includeParameterInMessage } from '../../util/include-parameter-in-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'ExternalServiceError'
const defaultService = ''
const myDefaults = { service : defaultService }

/**
 * Indicates an error related to an external service. Not that {@linkplain DatabaseError|database related errors have their own distinct class} which is used for both local and remote database errors.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link ConnectionError}
 * - {@link DatabaseError} and sub-types are used with database specific issues.
 * - {@link TimeoutError}
 * - {@link UnavailableError}
 * @category External service errors
 */
const ExternalServiceError = class extends CommonError {
  /**
   * {@link ExternalServiceError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.service = ''] - The name or short description of the service.
   * @param {string|undefined} [options.issue = undefined] - A description of the issue.
   {{> common-hidden-parameters }}
   * @example
   * new ExternalServiceError() // There was an error with a remote service.
   * new ExternalServiceError({ service : 'Foo API' }) // The was an error with the Foo API remote service.
   * // v "The remote service is not responding."
   * new ExternalServiceError({ issue : 'is not responding' })
   * // v "The remote service Foo API is not responding."
   * new ExternalServiceError({ service : 'Foo API', issue : 'is not responding' })
   */
  constructor({ name = myName, service = '', ...options } = {}, defaults) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message
      || generateMessage(undefined, { service, ...options }, defaults)
    super({ name, service, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ExternalServiceError).name)

ExternalServiceError.typeName = myName

const generateMessage = (errorType, options, defaults) => {
  const { issue } = options
  let { service } = options

  const showIssue = includeParameterInMessage('issue', options)
  service =
    includeParameterInMessage('service', options) === true
      ? service
      : defaults.service
  if (service.length > 0) {
    service += ' '
  }

  if (showIssue === true) {
    return `The remote ${service}service ${issue}.`
  }
  else {
    return `There was ${errorType || 'an'} error with the remote ${service}service.`
  }
}

export { ExternalServiceError }
