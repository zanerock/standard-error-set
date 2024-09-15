/* globals AuthenticationRequiredError CommonError NoAccessError OperationNotPermittedError */ // used in the docs
import { AuthError } from './auth-error'
import { includeParameterInMessage } from '../../util/include-parameter-in-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'AuthorizationConditionsNotMetError'
const defaultIssue = 'does not meet necessary conditions'
const myDefaults = { issue : defaultIssue }

/**
 * An {@link AuthError} indicating that the user is authorized to perform some action under some circumstances, but
 * additional conditions must be met. The blocking or necessary conditions should be described if possible.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link AuthenticationRequiredError} - Use this when the resource requires authenticated access and the user is not
 *   currently authenticated.
 * - {@link NoAccessError} - Use this when the user is accessing a resource the user has no authorizations to.
 * - {@link OperationNotPermittedError} - Use this when user is attempting an operation for which they have no
 *   authorization.
 * @category Auth errors
 */
const AuthorizationConditionsNotMetError = class extends AuthError {
  /**
   * Constructor for the {@link AuthorizationConditionsNotMetError}.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   {{< common-endpoint-parameters defaultEndpointType='action' }}
   * @param {string} [options.issue = 'current conditions prevent this action'] - A description of the problem. E.g.,
   *   'the user is over request quota', or 'this operation is only allowed between 0900 and 1700'.
   {{> common-hidden-parameters }}
   * @example
   * // v "User request is authorized but does not meet necessary conditions to invoke action."
   * new AuthorizationConditionsNotMet()
   * // v "User request is authorized but does not meet necessary conditions to access customer database."
   * new AuthorizationConditionsNotMet({ action: 'access', endpointType: 'customer data' })
   * // v "User request is authorized but user is over rate quota to invoke action."
   * new AuthorizationConditionsNotMet({ issue: 'user is over rate quota' })
   * // v "User request is authorized but does not meet necessary conditions to invoke action. Try again later.""
   * new AuthorizationConditionsNotMet({ hint: 'Try again later.' })
   */
  constructor(
    { name = myName, issue = defaultIssue, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    issue = 'request is authorized but ' + issue
    super({ name, issue, ...options }, defaults)
  }
}

registerParent(
  myName,
  Object.getPrototypeOf(AuthorizationConditionsNotMetError).name
)

AuthorizationConditionsNotMetError.typeName = myName

export { AuthorizationConditionsNotMetError }
