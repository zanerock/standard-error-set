import { AuthError } from './auth-error'
import { generateAuthMessage } from './lib/generate-auth-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'AuthenticationRequiredError'

/**
 * An {@link AuthError} sub-class indicating that an operation requires an authenticated user and the current us not
 * authenticated.
 */
const AuthenticationRequiredError = class extends AuthError {
  /**
   * {@link AuthenticationRequiredError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.action = 'action'] - A short description of the action.
   * @param {string|undefined} options.target - A short description of the action target.
   * @param {string} [options.issue = 'requires authorization'] - The auth issue.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new AuthenticationRequiredError() // "Action requires authentication."
   * new AuthenticationRequiredError({ action : 'endpoint access' }) // "Endpoint access requires authentication."
   * // v "Updating the customer database requires authentication."
   * new AuthenticationRequiredError({ action : 'updating', target : 'customer database' })
   */
  constructor({ name = myName, issue = 'requires authentication', ...options } = {}) {
    options.message = options.message || generateAuthMessage({ issue, ...options })
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(AuthenticationRequiredError).name)

AuthenticationRequiredError.typeName = myName

export { AuthenticationRequiredError }
