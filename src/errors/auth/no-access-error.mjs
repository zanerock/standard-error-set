/* globals AuthenticationRequiredError AuthorizationConditionsNotMetError CommonError maskNoAccessErrors NoAccessDirectoryError  NoAccessFileError NotFoundError OperationNotPermittedError */ // used in docs
import { AuthError } from './auth-error'
import { generateNoAccessMessage } from './lib/generate-no-access-message'
import {
  mapErrorToHttpStatus,
  registerParent
} from '../../settings/map-error-to-http-status'

const myName = 'NoAccessError'
const defaultResource = 'resource'
const myDefaults = { resource : defaultResource }

/**
 * An {@link AuthError} indicating a user lacks the rights to access a particular resource. This error is most
 * appropriate when trying to read or write something. If the user is attempting to perform an operation, consider the
 * {@link OperationNotPermittedError}. Note, in high security systems, it is often desirable to tell the user a
 * resource was 'not found', even when the problem is really an access issue, use and see {@link maskNoAccessErrors} to
 * deal with this situation.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link AuthenticationRequiredError} - Use this when the resource requires authenticated access and the user is not
 *   currently authenticated.
 * - {@link AuthorizationConditionsNotMetError} - Use this when the user is authorized to access the resource under
 *   some conditions.
 * - {@link NoAccessDirectoryError}
 * - {@link NoAccessFileError}
 * - {@link OperationNotPermittedError}
 * @category Auth errors
 */
const NoAccessError = class extends AuthError {
  /**
   * {@link NoAccessError} constructor. Refer to {@link NotFoundError} for additional examples of constructed messages
   * when a 404 status is set or mapped to this error type.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.resource = undefined] - A description of the resource attempting to be accessed.
   * @param {number} [options.status = (404 | 409)] - The HTTP status of the error. Should generally be left undefined
   *   so as to be automatically determined according to [@link mapErrorToHttpStatus | configured error mapping].
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new NoAccessError() // "Access to resource is denied."
   * new NoAccessError() // when mapped to 404 status: "Resource is not found."
   * new NoAccessError({ resource : 'terminal connection' }) // Access to terminal connection is denied.
   */
  constructor({ name = myName, status, ...options } = {}, defaults) {
    defaults = Object.assign({}, myDefaults, defaults)
    status = status || mapErrorToHttpStatus(myName)
    options.message =
      options.message
      || generateNoAccessMessage({ status, ...options }, defaults)
    if (status === 404 && options.code === undefined) {
      options.code = 'ENOENT'
    }

    super({ name, status, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(NoAccessError).name)

NoAccessError.typeName = myName

export { NoAccessError }
