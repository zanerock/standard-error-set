/* globals CommonError */ // ref in docs
import { AuthError } from './auth-error'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'AuthenticationRequiredError'
const defaultAction = 'action'
const defaultIssue = 'requires authentication'
const myDefaults = { action : defaultAction, issue : defaultIssue }

/**
 * An {@link AuthError} sub-class indicating that an operation requires an authenticated user and the current us not
 * authenticated.
 * @category Auth errors
 */
const AuthenticationRequiredError = class extends AuthError {
  /**
   * {@link AuthenticationRequiredError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.action = 'action'] - A short description of the action.
   * @param {string|undefined} [options.target = undefined] - A short description of the action target.
   * @param {string} [options.issue = 'requires authorization'] - The auth issue.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new AuthenticationRequiredError() // "Action requires authentication."
   * new AuthenticationRequiredError({ action : 'endpoint access' }) // "Endpoint access requires authentication."
   * // v "Updating the customer database requires authentication."
   * new AuthenticationRequiredError({ action : 'updating', target : 'customer database' })
   */
  constructor(
    {
      name = myName,
      action = defaultAction,
      issue = defaultIssue,
      ...options
    } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    super({ name, action, issue, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(AuthenticationRequiredError).name)

AuthenticationRequiredError.typeName = myName

export { AuthenticationRequiredError }
