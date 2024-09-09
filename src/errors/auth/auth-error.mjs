/* globals AuthenticationRequiredError BadCredentialsError NoAccessError OperationNotPermittedError */
import { CommonError } from '../common-error'
import { generateAuthMessage } from './lib/generate-auth-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'AuthError'
const defaultAction = 'action'
const defaultIssue = 'is not authorized'
const myDefaults = { action : defaultAction, issue : defaultIssue }

/**
 * A generic error indicating a problem with user authentication or authorization. `AuthError` should generally not be
 * used directly, but instead is intended as a base class for auth related errors allowing consumers to check for auth
 * related errors broadly (`e.g., instanceof AuthError`). Generally, will want to use one of the following:
 * - {@link AuthenticationRequiredError}
 * - {@link BadCredentialsError}
 * - {@link NoAccessError}
 * - {@link OperationNotPermittedError}
 * @category Auth errors
 */
const AuthError = class extends CommonError {
  /**
   * {@link AuthError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.action = 'action'] - A short description of the action.
   * @param {string|undefined} [options.target = undefined] - The name or short description of the target.
   * @param {string} [options.issue = 'is not authorized'] - The auth issue.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new AuthError() // "Action is not authorized."
   * new AuthError({ action : 'dancing' }) // "Dancing is not authorized."
   * new AuthError({ issue : 'is not permitted' }) // Action is not permitted.
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
    options.message =
      options.message
      || generateAuthMessage({ action, issue, ...options }, defaults)
    super({ name, action, issue, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(AuthError).name)

AuthError.typeName = myName

export { AuthError }
