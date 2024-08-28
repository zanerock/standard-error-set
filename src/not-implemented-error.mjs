/* global NotSupportedError UnavailableError */ // used in docs
import { CommonError } from './common-error'
import { includeParameterInMessage } from './lib/include-parameter-in-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'NotImplementedError'

/**
 * An error indicating the requested operation is not currently implemented.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link NotSupportedError} - Use this when the target is implemented, but does not support some feature or
 *   condition captured in the request.
 * - {@link UnavailableError} - Use this when a resource exists, but is temporarily unavailable for some reason.
 */
const NotImplementedError = class extends CommonError {
  /**
   * {@link NotImplementedError} constructor.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.target = undefined] - The name of the function, endpoint, service, etc. which
   *   the user is trying to invoke.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new NotImplementedError() // "Action not currently implemented."
   * new NotImplementedError({ target: '/some/url/endpoint'}) // "'/some/url/endpoint' is not currently implemented."
   */
  constructor({ name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NotImplementedError).name)

NotImplementedError.typeName = myName

const generateMessage = (options) => {
  if (includeParameterInMessage('target', options)) {
    return `'${options.target}' is not currently implemented.`
  } else {
    return 'Action not currently implemented.'
  }
}

export { NotImplementedError }
