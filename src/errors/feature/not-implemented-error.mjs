/* global NotSupportedError UnavailableError */ // used in docs
import { CommonError } from '../common-error'
import { describeEndpoint } from '../lib/describe-endpoint'
import { includeParameterInMessage } from '../../util/include-parameter-in-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'NotImplementedError'
const defaultEndpointType = 'command'
const myDefaults = { endpointType : defaultEndpointType }

/**
 * An error indicating the requested operation is not currently implemented.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link NotSupportedError} - Use this when the target is implemented, but does not support some feature or
 *   condition captured in the request.
 * - {@link UnavailableError} - Use this when a resource exists, but is temporarily unavailable for some reason.
 * @category Feature errors
 */
const NotImplementedError = class extends CommonError {
  /**
   * {@link NotImplementedError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   {{> common-endpoint-parameters }}
   {{> common-hidden-parameters noDefaults=true }}
   * @example
   * new NotImplementedError() // "Action not currently implemented."
   * // v "URL '/some/url/endpoint' is not currently implemented."
   * new NotImplementedError({ endpointType: 'URL', endpointName: '/some/url/endpoint'})
   */
  constructor({ name = myName, ...options } = {}, defaults) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message = options.message || generateMessage(options, defaults)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NotImplementedError).name)

NotImplementedError.typeName = myName

const generateMessage = (options, defaults) => {
  if (includeParameterInMessage('endpointType', options)
      || includeParameterInMessage('endpointName', options)
      || includeParameterInMessage('packageName', options)) {
    return `${describeEndpoint(options, defaults)} is not currently implemented.`
  }
  else {
    return 'Action not currently implemented.'
  }
}

export { NotImplementedError }
