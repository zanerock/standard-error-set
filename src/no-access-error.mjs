import { AuthError } from './auth-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'NoAccessError'

/**
 * An {@link AuthError} indicating a user lacks the rights to access a particular resource. Note, in high security
 * systems, it is often desirable to tell the user a resource was 'not found', even when the problem is really an
 * access issue, use and see {@link hideAccessErrors} to deal with this situation.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link AuthenticationRequiredError} - Use this when the resource requires authenticated access and the user is not
 *   currently authenticated.
 * - {@link OperationNotPermittedError}
 */
const NoAccessError = class extends AuthError {
  constructor ({ message, status, ...options } = {}) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NoAccessError).name)

NoAccessError.typeName = myName

export { NoAccessError }
