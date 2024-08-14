import { CommonError } from './common-error'

const name = 'AuthError'

/**
 * A generic error indicating a problem with user authentication or authorization. `AuthError` should generally not be 
 * used directly, but instead is intended as a base class for auth related errors allowing consumers to check for auth 
 * related errors broadly (`e.g., instanceof AuthError`). Generally, will want to use one of the following:
 * - {@link AuthenticationRequiredError}
 * - {@link BadCredentialsError}
 * - {@link NotPermittedError}
 */
const AuthError = class extends CommonError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

AuthError.typeName = name

export { AuthError }