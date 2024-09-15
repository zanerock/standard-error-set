/* global AuthenticationRequiredError AuthorizationConditionsNotMetError BadCredentialsError AuthorizationConditionsNotMetError CommonError NoAccessError */ // used in docs
import { AuthError } from './auth-error'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'OperationNotPermittedError'
const defaultIssue = 'is not permitted'
const myDefaults = { issue : defaultIssue } // the default action is determined dynamically

/**
 * An {@link AuthError} indicating the user lacks authorization to perform some operation. This is most appropriate
 * when the user is trying to _do_ something. If the user is attempting to "access" a resource, the {@link
 * NoAccessError} or it's children may be better suited. Consider whether any of the following errors might be more
 * precise or better suited:
 * - {@link AuthenticationRequiredError}
 * - {@link AuthorizationConditionsNotMetError} - Use this when the user is authorized to perform the operation under
 *   some conditions.
 * - {@link BadCredentialsError}
 * - {@link AuthorizationConditionsNotMetError}
 * - {@link NoAccessError}
 * @category Auth errors
 */
const OperationNotPermittedError = class extends AuthError {
  /**
   * {@link OperationNotPermittedError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   {{< common-endpoint-parameters defaultEndpointType='action' }}
   * @param {string|undefined} [options.target = undefined] - The name or short description of the target.
   * @param {string} [options.issue = 'is not permitted'] - The auth issue.
   {{> common-hidden-parameters }}
   * @example
   * new OperationNotPermittedError() // "User is not permitted to invoke action."
   * // v "User is not permitted to update database."
   * new OperationNotPermittedError({ action : 'update', endpointType : 'database' })
   * // v "User is not permitted to access database 'customer'."
   * new OperationNotPermittedError({ action: 'access', endpointType : 'database', endpointName : 'customer' })
   * new OperationNotPermittedError({ issue : 'is not authorized' }) // "User is not authorized to invoke action."
   */
  constructor(
    { name = myName, endpointType, issue = defaultIssue, target, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    if (endpointType === undefined && target !== undefined) {
      endpointType = 'accessing'
      defaults.endpointType = endpointType
    }
    super({ name, endpointType, issue, target, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(OperationNotPermittedError).name)

OperationNotPermittedError.typeName = myName

export { OperationNotPermittedError }
