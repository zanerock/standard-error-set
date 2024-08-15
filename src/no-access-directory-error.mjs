/* globals AuthenticationRequiredError maskNoAccessErrors NoAccessFileError OperationNotPermittedError */
import { NoAccessError } from './no-access-error'
import { describeDirectory } from './lib/describe-directory'
import { registerParent } from './map-error-to-http-status'

const myName = 'NoAccessDirectoryError'

/**
 * An {@link NoAccessError} indicating a user lacks the rights to access a particular directory. Note, in high security
 * systems, it is often desirable to tell the user a resource was 'not found', even when the problem is really an
 * access issue, use and see {@link maskNoAccessErrors} to deal with this situation.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link AuthenticationRequiredError} - Use this when the resource requires authenticated access and the user is not
 *   currently authenticated.
 * - {@link NoAccessError}
 * - {@link NoAccessFileError}
 * - {@link OperationNotPermittedError}
 * @param {string|undefined} dirPath - The directory (not including the file itself) where the file is located.
 * @param {string|undefined} resource - Should usually be left undefined. If set, then the value will override
 *   `dirPath` and be used to generate the standard message if `message` option not set.}
 */
const NoAccessDirectoryError = class extends NoAccessError {
  constructor ({ name = myName, status, ...options } = {}) {
    const resource = describeDirectory(options)
    options.resource = options.resource || resource

    super({ name, status, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NoAccessDirectoryError).name)

NoAccessDirectoryError.typeName = myName

export { NoAccessDirectoryError }
