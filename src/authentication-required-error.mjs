import { AuthError } from './auth-error'

const name = 'AuthenticationRequiredError'

/**
 * An {@link AuthError} indicating that an operation requires an authenticated user and the current us not 
 * authenticated.
 */
const AuthenticationRequiredError = class extends AuthError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

AuthenticationRequiredError.typeName = name

export { AuthenticationRequiredError }