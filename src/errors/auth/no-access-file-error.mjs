/* globals AuthenticationRequiredError AuthorizationConditionsNotMetError CommonError FileNotFoundError maskNoAccessErrors NoAccessDirectoryError OperationNotPermittedError */
import { NoAccessError } from './no-access-error'
import { describeFile } from '../lib/describe-file'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'NoAccessFileError'
const defaultResource = 'file'
const myDefaults = { resource : defaultResource }

/**
 * An {@link NoAccessError} indicating a user lacks the rights to access a particular file. Note, in high security
 * systems, it is often desirable to tell the user a resource was 'not found', even when the problem is really an
 * access issue, use and see {@link maskNoAccessErrors} to deal with this situation.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link AuthenticationRequiredError} - Use this when the resource requires authenticated access and the user is not
 *   currently authenticated.
 * - {@link AuthorizationConditionsNotMetError} - Use this when the user is authorized to access the file under some
 *   conditions.
 * - {@link NoAccessDirectoryError}
 * - {@link NoAccessError}
 * - {@link OperationNotPermittedError}
 * @category Auth errors
 */
const NoAccessFileError = class extends NoAccessError {
  /**
   * {@link NoAccessFileError} constructor. Refer to {@link FileNotFoundError} for additional examples of constructed
   * messages when a 404 status is set or mapped to this error type.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.dirPath = undefined] - The directory (not including the file itself) where the
   *   file is located. If defined, and the `resource` option is undefined, then `dirPath` is combined with `fileName`,
   *   if present, to define the `resource`. This option cannot be suppressed directly, but the `resource` can be.
   * @param {string|undefined} [options.fileName = undefined] - The name of the file itself. May be a full path (in
   *   which case `dirPath` should be left undefined) or just the file name. If defined, and the `resource` option is
   *   undefined, then `fileName` is combined with `dirPath`, if present, to define the `resource`. This option cannot
   *   be suppressed directly, but the `resource` can be.
   * @param {string|undefined} [options.resource = undefined] - Should usually be left undefined. If set, then the
   *   value will override `fileName` and `dirPath` and be used to generate the standard message if `message` option
   *   not set.
   {{> common-hidden-parameters }}
   * @example
   * new NoAccessFileError() // "Access to file is denied."
   * new NoAccessFileError() // when status is 404: "File not found."
   * new NoAccessFileError({ fileName: 'bar' }) // Access to file 'bar' is denied.
   * new NoAccessFileError({ dirPath: '/foo', fileName: 'bar' }) // Access to file '/foo/bar' is denied.
   * new NoAccessFileError({ dirPath: '/foo' }) // Access to file in directory '/foo' is denied.
   */
  constructor({ name = myName, ...options } = {}, defaults) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.resource = options.resource || describeFile(options)

    super({ name, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(NoAccessFileError).name)

NoAccessFileError.typeName = myName

export { NoAccessFileError }
