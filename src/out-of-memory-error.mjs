/* global NotImplementedError UnavailableError */ // used in docs
import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'OutOfMemoryError'

/**
 * An error indicating that the resource exists, but does not support some aspect of the request as is. This is most 
 * typically used when implementing a specification, but where some feature of the specification is not implemented. 
 * E.g., let's say a specification says requests can use JSON or YAML, but we only implement JSON support. If we get a 
 * request with a YAML payload, we could throw a `OutOfMemoryError`.
 * 
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link NotImplemented} - Use this when the target is not implemented at all.
 * - {@link UnavailableError} - Use this when the target is implemented, but temporarily unavailable for some reason.
 */
const OutOfMemoryError = class extends CommonError {
  /**
   * Constructor for {$link OutOfMemoryError}.
   * 
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} options - The constructor options.
   * @param {string|undefined} options.resource - The name or short description of the resource which has run out of memory.
   * @example
   * new OutOfMemoryError() // "The process is out of memory."
   * // v "The application is out of memory."
   * new OutOfMemoryError({ resource: 'application'}) 
   */
  constructor ({ name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(OutOfMemoryError).name)

OutOfMemoryError.typeName = myName

const generateMessage = ({ resource = 'process'}) =>
  `The ${resource} is out of memory.`

export { OutOfMemoryError }
