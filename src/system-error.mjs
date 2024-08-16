/* global NotImplementedError UnavailableError */ // used in docs
import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'SystemError'

/**
 * An error indicating a system error. When used to wrap native system errors (like `ReferenceError`, `SyntaxError`, etc.), be sure to set the `cause` option.
 */
const SystemError = class extends CommonError {
  /**
   * Constructor for {$link SystemError}.
   * 
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} options - The constructor options.
   * @param {string|undefined} options.resource - The name or short description of the resource which has run out of memory.
   * @example
   * new SystemError() // "The process has experienced a System."
   * // v "The application has experienced a stack overflow."
   * new SystemError({ resource: 'application'}) 
   */
  constructor ({ name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(SystemError).name)

SystemError.typeName = myName

const generateMessage = ({ resource = 'process'}) =>
  `The ${resource} has experienced a system error.`

export { SystemError }
