import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'TimeoutError'

/**
 * Indicates an operation is taking too much time.
 */
const TimeoutError = class extends CommonError {
  /**
   * The {@link TimeoutError} constructor.
   * @param {object} options - The constructor options.
   * @param {string|undefined} options.resource - The name or short description of the thing which is timing out.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * // new TimeoutError() // "The process has timed out."
   * // new TimeoutError({ resource : 'user session' }) // "The user session has timed out."
   */
  constructor ({ name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(TimeoutError).name)

TimeoutError.typeName = myName

const generateMessage = ({ resource = 'process' }) =>
  `The ${resource} has timed out.`

export { TimeoutError }
