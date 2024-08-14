import { AuthError } from './auth-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'NotPermittedError'

/**
 * An {@link AuthError} indicating the user lacks authorization to perform some operation. Consider whether any of the
 * following errors might be more precise or better suited:
 * - {@link AuthenticationError}
 * - {@link BadCredentialsError}
 * - {@link AuthorizationConditionsNotMetError}
 * - {@link NoAccessError}
 */
const NotPermittedError = class extends AuthError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NotPermittedError).name)

NotPermittedError.typeName = myName

export { NotPermittedError }
