import { AuthError } from './auth-error'
import { generateNotFoundMessage } from './lib/generate-not-found-message'
import { mapErrorToHttpStatus } from './map-error-to-http-status'
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
 * - {@link OperationOperationNotPermittedError}
 */
const NoAccessError = class extends AuthError {
  constructor ({ name = myName, message, status, ...options } = {}) {
    status = status || mapErrorToHttpStatus(myName)
    options.message = options.message || generateMessage({ status, ...options })
    if (status === 404 && options.code === undefined) {
      options.code = 'ENOENT'
    }

    super({ name, status, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NoAccessError).name)

NoAccessError.typeName = myName

const generateMessage = ({ resource, status }) => {
  if (status === 404) {
    return generateNotFoundMessage({ resource })
  } else {
    return `Access ${resource === undefined ? '' : `to ${resource} `}is denied.`
  }
}

export { NoAccessError }
