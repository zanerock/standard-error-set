/* globals AuthenticationRequiredError AuthorizationConditionsNotMetError CommonError DirectoryNotFoundError maskNoAccessErrors NoAccessFileError OperationNotPermittedError */
import { NoAccessError } from './no-access-error'
import { describeDirectory } from '../lib/describe-directory'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'NoAccessDirectoryError'
const defaultResource = 'directory'
const myDefaults = { resource : defaultResource }

/**
 * An {@link NoAccessError} indicating a user lacks the rights to access a particular directory. Note, in high security
 * systems, it is often desirable to tell the user a resource was 'not found', even when the problem is really an
 * access issue, use and see {@link maskNoAccessErrors} to deal with this situation.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link AuthenticationRequiredError} - Use this when the resource requires authenticated access and the user is not
 *   currently authenticated.
 * - {@link AuthorizationConditionsNotMetError} - Use this when the user is authorized to access the directory under
 *   some conditions.
 * - {@link NoAccessError}
 * - {@link NoAccessFileError}
 * - {@link OperationNotPermittedError}
 * @category Auth errors
 */
const NoAccessDirectoryError = class extends NoAccessError {
  /**
   * {@link NoAccessDirectoryError} constructor. Refer to {@link DirectoryNotFoundError} for additional examples of
   * constructed messages when a 404 status is set or mapped to this error type.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.dirPath = undefined] - The directory (not including the file itself) where the
   *   file is located.
   * @param {string|undefined} [options.resource = undefined] - Should usually be left undefined. If set, then the
   *   value will override `dirPath` and be used to generate the standard message if `message` option not set.}
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new NoAccessDirectoryError() // "Access to directory is denied."
   * new NoAccessDirectoryError() // when access errors mapped to 404: "Directory not found."
   * new NoAccessDirectoryError({ dirPath = '/foo' }) // "Access to director '/foo' is denied"
   */
  constructor({ name = myName, ...options } = {}, defaults) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.resource = options.resource || describeDirectory(options)

    super({ name, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(NoAccessDirectoryError).name)

NoAccessDirectoryError.typeName = myName

export { NoAccessDirectoryError }
