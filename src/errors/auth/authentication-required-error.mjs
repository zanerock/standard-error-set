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
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.action = 'action'] - A short description of the action.
   * @param {string|undefined} [options.target = undefined] - A short description of the action target.
   * @param {string} [options.issue = 'requires authorization'] - The auth issue.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   {{> common-hidden-parameters }}
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
