/* globals AuthenticationRequiredError BadCredentialsError NoAccessError OperationNotPermittedError */
import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'AuthError'

/**
 * A generic error indicating a problem with user authentication or authorization. `AuthError` should generally not be
 * used directly, but instead is intended as a base class for auth related errors allowing consumers to check for auth
 * related errors broadly (`e.g., instanceof AuthError`). Generally, will want to use one of the following:
 * - {@link AuthenticationRequiredError}
 * - {@link BadCredentialsError}
 * - {@link NoAccessError}
 * - {@link OperationNotPermittedError}
 */
const AuthError = class extends CommonError {
  /**
   * {@AuthError} constructor.
   * @param {object|undefined} options - Creation objects.
   * @param {string|undefined} options.message - The error message.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   */
  constructor ({ name = myName, message = 'An auth error has ocurred.', ...options } = {}) {
    super({ name, message, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(AuthError).name)

AuthError.typeName = myName

export { AuthError }
