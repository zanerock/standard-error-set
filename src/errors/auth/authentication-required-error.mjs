/* globals CommonError */ // ref in docs
import { AuthError } from './auth-error'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'AuthenticationRequiredError'
const defaultIssue = 'requires authentication'
const myDefaults = { issue : defaultIssue }

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
   {{> common-auth-parameters defaultAction='access' defaultIssue='requires authentication' defaultEndpointType='action'}}
   {{> common-hidden-parameters }}
   * @example
   * new AuthenticationRequiredError() // "User requires authentication to invoke action."
   * // v "Use requires authentication to access URL."
   * new AuthenticationRequiredError({ action : 'access', endpointType : 'URL' })
   * // v "User requires authentication to update customer database."
   * new AuthenticationRequiredError({ action : 'update', endpointType : 'customer database' })
   */
  constructor(
    {
      name = myName,
      issue = defaultIssue,
      ...options
    } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    super({ name, issue, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(AuthenticationRequiredError).name)

AuthenticationRequiredError.typeName = myName

export { AuthenticationRequiredError }
