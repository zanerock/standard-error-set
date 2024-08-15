import { NoAccessError } from './no-access-error'
import { describeFile } from './lib/describe-file'
import { generateNoAccessMessage } from './lib/generate-no-access-message'
import { mapErrorToHttpStatus, registerParent } from './map-error-to-http-status'

const myName = 'NoAccessFileError'

/**
 * An {@link NoAccessError} indicating a user lacks the rights to access a particular file. Note, in high security
 * systems, it is often desirable to tell the user a resource was 'not found', even when the problem is really an
 * access issue, use and see {@link maskNoAccessErrors} to deal with this situation.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link AuthenticationRequiredError} - Use this when the resource requires authenticated access and the user is not
 *   currently authenticated.
 * - {@link NoAccessDirectoryError}
 * - {@link NoAccessError}
 * - {@link OperationOperationNotPermittedError}
 * @param {string|undefined} dirPath - The directory (not including the file itself) where the file is located.
 * @param {string|undefined} fileName - The name of the file itself. May be a full path (in which case `dirPath` should
 *   be left undefined) or just the file name, in which case it is combined with `dirPath`, if present, to create the
 *   standard error message.
 * @param {string|undefined} resource - Should usually be left undefined. If set, then the value will override
 *   `fileName` and `dirPath` and be used to generate the standard message if `message` option not set.
 */
const NoAccessFileError = class extends NoAccessError {
  constructor ({ name = myName, message, status, ...options } = {}) {
    const resource = describeFile(options)
    options.resource = options.resource || resource

    super({ name, status, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NoAccessFileError).name)

NoAccessFileError.typeName = myName

export { NoAccessFileError }
