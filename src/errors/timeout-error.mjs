import { CommonError } from './common-error'
import { includeParameterInMessage } from '../util/include-parameter-in-message'
import { registerParent } from '../settings/map-error-to-http-status'

const myName = 'TimeoutError'
const defaultResource = 'process'
const myDefaults = { resource : defaultResource }

/**
 * Indicates an operation is taking too much time.
 */
const TimeoutError = class extends CommonError {
  /**
   * {@link TimeoutError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.resource = undefined] - The name or short description of the thing which is
   *   timing out.
   * @param {boolean} [options.isLocal = false] - Indicates whether the error arises from a remote service our not (
   *   e.g., a connection timeout).
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   {{> common-hidden-parameters }}
   * @example
   * // new TimeoutError() // "The process has timed out."
   * // new TimeoutError({ resource : 'user session' }) // "The user session has timed out."
   * @category General errors
   */
  constructor(
    { name = myName, resource = defaultResource, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message || generateMessage({ resource, ...options, defaults })
    super({ name, resource, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(TimeoutError).name)

TimeoutError.typeName = myName

const generateMessage = (options, defaults) => {
  const { isLocal, resource } = options
  const showRemote =
    includeParameterInMessage('isLocal', options) && isLocal === false
  const showResource = includeParameterInMessage('resource', options)

  return `The ${showRemote ? 'remote ' : ''}${showResource ? resource : defaults.resource} has timed out.`
}

export { TimeoutError }
