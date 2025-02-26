import { CommonError } from './common-error'
import { includeParameterInMessage } from './lib/include-parameter-in-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'TimeoutError'
const defaultResource = 'process'
const myDefaults = { resource : defaultResource }

/**
 * Indicates an operation is taking too much time.
 */
const TimeoutError = class extends CommonError {
  /**
   * {@link TimeoutError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.resource = undefined] - The name or short description of the thing which is
   *   timing out.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * // new TimeoutError() // "The process has timed out."
   * // new TimeoutError({ resource : 'user session' }) // "The user session has timed out."
   */
  constructor(
    { name = myName, resource = defaultResource, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message || generateMessage({ resource, ...options, defaults })
    super({ name, resource, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(TimeoutError).name)

TimeoutError.typeName = myName

const generateMessage = (options, defaults) =>
  `The ${includeParameterInMessage('resource', options) ? options.resource : defaults.resource} has timed out.`

export { TimeoutError }
