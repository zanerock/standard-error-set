/* global NotImplementedError UnavailableError */ // used in docs
import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'NotSupportedError'

/**
 * An error indicating that the resource exists, but does not support some aspect of the request as is. This is most
 * typically used when implementing a specification, but where some feature of the specification is not implemented.
 * E.g., let's say a specification says requests can use JSON or YAML, but we only implement JSON support. If we get a
 * request with a YAML payload, we could throw a `NotSUpportedError`.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link NotImplementedError} - Use this when the target is not implemented at all.
 * - {@link UnavailableError} - Use this when the target is implemented, but temporarily unavailable for some reason.
 */
const NotSupportedError = class extends CommonError {
  /**
   * {@link NotSupportedError} constructor.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.issue = undefined] - A short description of the thing which is not supported. 
   *   E.g., 'YAML request payloads' or 'asynchronous execution'.
   * @param {string|undefined} [options.hint = undefined] - A short hint to the user as to how they might resolve or 
   *   workaround the issue. This should be a complete sentence. E.g., 'Encode request in JSON.' or 'Try synchronous 
   *   execution.'
   * @param {string|undefined} [options.target = undefined] - The name of the function, endpoint, service, etc. which 
   *   the user is trying to invoke. E.g., '/some/url/endpoint' or 'myFunction()'
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new NotSupportedError() // "The target does not currently support a requested feature."
   * // v "'/some/endpoint' does not currently support some requested feature."
   * new NotSupportedError({ target: '/some/endpoint'})
   * // v "'myFunc()' does not currently support RFC 3339 style dates."
   * new NotSupportedError({ target: 'myFunc()', issue: 'RFC 3339 style dates' })
   * // v "The target does not currently support YAML payloads. Send request in JSON."
   * new NotSupportedError({ issue: 'YAML payloads', hint : 'Send request in JSON.' })
   */
  constructor({ name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NotSupportedError).name)

NotSupportedError.typeName = myName

const generateMessage = ({ hint, issue, target }) => {
  let message = target === undefined ? 'The target ' : `'${target}' `
  message += 'does not currently support '
  message += issue === undefined ? 'a requested feature.' : `${issue}.`
  if (hint !== undefined) {
    message += ' ' + hint
  }

  return message
}

export { NotSupportedError }
