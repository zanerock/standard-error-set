import { mapErrorToHttpStatus } from './map-error-to-http-status'
import { NoAccessDirectoryError } from '../errors/auth/no-access-directory-error'
import { NoAccessError } from '../errors/auth/no-access-error'
import { NoAccessFileError } from '../errors/auth/no-access-file-error'

/**
 * Remaps {@link NoAccessError}s (and all children) to a 404 (Not Found) status and changes the generated message. This
 * will effectively remap and custom mappings of {@link NoAccessError} or it's children that may be in place. This  is a
 * common practice in secure systems where it is undesirable to give attackers any information about a resource they
 * don't have access to. I.e., if a user tries to access a resource they are not permitted to access, an unmasked {@link
 * NoAccessError} would divulge the existence of a resource. Note, this does not change the class of the error itself,
 * so and developers _should_ continue to use {@link NoAccessError}s where the problem is actually access. In
 * production systems, the [presentation of errors to the users](#presenting-errors-to-users) should not indicate the
 * underlying type.
 * @category Settings management
 */
const maskNoAccessErrors = () => {
  mapErrorToHttpStatus(NoAccessError, 404)
  // remove any custom mappings on the children
  mapErrorToHttpStatus(NoAccessDirectoryError, undefined)
  mapErrorToHttpStatus(NoAccessFileError, undefined)
}

export { maskNoAccessErrors }
