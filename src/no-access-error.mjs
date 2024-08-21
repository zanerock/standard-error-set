/* globals AuthenticationRequiredError AuthorizationConditionsNotMetError CommonError NoAccessDirectoryError maskNoAccessErrors NoAccessFileError OperationNotPermittedError */ // used in docs
import { AuthError } from './auth-error'
import { generateNoAccessMessage } from './lib/generate-no-access-message'
import { mapErrorToHttpStatus, registerParent } from './map-error-to-http-status'

const myName = 'NoAccessError'

/**
 * An {@link AuthError} indicating a user lacks the rights to access a particular resource. This error is most
 * appropriate when trying to read or write something. If the user is attempting to perform an operation, consider the
 * {@OperationNotPermittedError}. Note, in high security systems, it is often desirable to tell the user a resource was
 * 'not found', even when the problem is really an access issue, use and see {@link maskNoAccessErrors} to deal with
 * this situation.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link AuthenticationRequiredError} - Use this when the resource requires authenticated access and the user is not
 *   currently authenticated.
 * - {@link AuthorizationConditionsNotMetError} - Use this when the user is authorized to access the resource under
 *   some conditions.
 * - {@link NoAccessDirectoryError}
 * - {@link NoAccessFileError}
 * - {@link OperationNotPermittedError}
 */
const NoAccessError = class extends AuthError {
  /**
   * {@link NoAccessError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} options.resource - A description of the resource attempting to be accessed.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   */
  constructor({ name = myName, status, ...options } = {}) {
    status = status || mapErrorToHttpStatus(myName)
    options.message = options.message || generateNoAccessMessage({ status, ...options })
    if (status === 404 && options.code === undefined) {
      options.code = 'ENOENT'
    }

    super({ name, status, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NoAccessError).name)

NoAccessError.typeName = myName

export { NoAccessError }
