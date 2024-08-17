/* global AuthenticationError AuthorizationConditionsNotMetError BadCredentialsError AuthorizationConditionsNotMetError NoAccessError */ // used in docs
import { AuthError } from './auth-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'OperationNotPermittedError'

/**
 * An {@link AuthError} indicating the user lacks authorization to perform some operation. This is most appropriate
 * when the user is trying to _do_ something. If the user is attempting to "access" a resource, the {@link
 * NoAccessError} or it's children may be better suited. Consider whether any of the following errors might be more
 * precise or better suited:
 * - {@link AuthenticationError}
 * - {@link AuthorizationConditionsNotMetError} - Use this when the user is authorized to perform the operation under
 *   some conditions.
 * - {@link BadCredentialsError}
 * - {@link AuthorizationConditionsNotMetError}
 * - {@link NoAccessError}
 */
const OperationNotPermittedError = class extends AuthError {
  constructor ({ name = myName, ...options } = {}) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(OperationNotPermittedError).name)

OperationNotPermittedError.typeName = myName

export { OperationNotPermittedError }
