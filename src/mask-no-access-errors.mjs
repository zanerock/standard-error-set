import { mapErrorToHttpStatus } from './map-error-to-http-status'
import { NoAccessError } from './no-access-error'

/**
 * Remaps {@link NoAccessError}s to a 404 (Not Found) status and changes the generated message. This is a common
 * practice in secure systems where it is undesirable to give attackers any information about a resource they don't
 * have access to. I.e., if a user tries to access a resource they are not permitted to access, a {@link NoAccessError}
 * would divulge the existence of a resource, so instead high security systems will usually prefer a {@link
 * NotFoundError} so as to not give anything away. Note, this does not change the class of the error itself, so
 * one must take care in how [errors are presented to users](#presenting-errors-to-users).
 */
const maskNoAccessErrors = () => {
  mapErrorToHttpStatus(NoAccessError, 404)
}

export { maskNoAccessErrors }