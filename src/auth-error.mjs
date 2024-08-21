/* globals AuthenticationRequiredError BadCredentialsError NoAccessError OperationNotPermittedError */
import { CommonError } from './common-error'
import { generateAuthMessage } from './lib/generate-auth-message'
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
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} options.action - A short description of the action.
   * @param {string|undefined} options.target - The name or short description of the target.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   */
  constructor({ name = myName, ...options } = {}) {
    options.message = options.message || generateAuthMessage('is not authorized', options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(AuthError).name)

AuthError.typeName = myName

export { AuthError }
