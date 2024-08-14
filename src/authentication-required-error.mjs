import { AuthError } from './auth-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'AuthenticationRequiredError'

/**
 * An {@link AuthError} indicating that an operation requires an authenticated user and the current us not
 * authenticated.
 */
const AuthenticationRequiredError = class extends AuthError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(AuthenticationRequiredError).name)

AuthenticationRequiredError.typeName = myName

export { AuthenticationRequiredError }
