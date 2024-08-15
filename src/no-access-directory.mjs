import { NoAccessError } from './no-access-error'
import { describeDirectory } from './lib/describe-directory'
import { describeNoAccessMessage } from './lib/describe-no-access-message'
import { mapErrorToHttpStatus, registerParent } from './map-error-to-http-status'

const myName = 'NoAccessDirectoryError'

/**
 * An {@link AuthError} indicating a user lacks the rights to access a particular file. Note, in high security
 * systems, it is often desirable to tell the user a resource was 'not found', even when the problem is really an
 * access issue, use and see {@link maskNoAccessErrors} to deal with this situation.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link AuthenticationRequiredError} - Use this when the resource requires authenticated access and the user is not
 *   currently authenticated.
 * - {@link NoAccessDirectoryError}
 * - {@link NoAccessError}
 * - {@link OperationOperationNotPermittedError}
 */
const NoAccessDirectoryError = class extends NoAccess {
  constructor ({ name = myName, message, status, ...options } = {}) {
    status = status || mapErrorToHttpStatus(myName)
    const resource = describeDirectory(options)
    options.resource = options.resource || resource
    options.message = options.message || generateNoAccessMessage({ status, ...options })

    super({ name, status, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NoAccessDirectoryError).name)

NoAccessDirectoryError.typeName = myName

export { NoAccessDirectoryError }
