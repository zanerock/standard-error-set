import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'SystemError'

/**
 * An error indicating a system error. When used to wrap native system errors (like `ReferenceError`, `SyntaxError`, etc.), be sure to set the `cause` option.
 */
const SystemError = class extends CommonError {
  /**
   * {@link SystemError} constructor.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.resource = undefined] - The name or short description of the resource which has 
   *   run out of memory.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new SystemError() // "The process has experienced a System."
   * // v "The application has experienced a stack overflow."
   * new SystemError({ resource: 'application'})
   */
  constructor({ name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(SystemError).name)

SystemError.typeName = myName

const generateMessage = ({ resource = 'process' }) =>
  `The ${resource} has experienced a system error.`

export { SystemError }
