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
   * @param {string} [options.issue = 'has experienced a system error'] - A description of the error.
   * @param {string} [options.resource = 'process'] - The name or short description of the resource where the error
   *   occurred.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new SystemError() // "The process has experienced a System."
   * // v "The application has experienced a stack overflow."
   * new SystemError({ resource: 'application'})
   */
  constructor({ name = myName, issue = 'has experienced a system error', resource = 'the process', ...options } = {}) {
    options.message = options.message || `${resource.charAt(0).toUpperCase() + resource.slice(1)} ${issue}.`
    super({ name, issue, resource, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(SystemError).name)

SystemError.typeName = myName

export { SystemError }
