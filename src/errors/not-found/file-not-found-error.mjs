/* globals CommonError DirectoryNotFoundError */ // used in docs
import { describeFile } from '../lib/describe-file'
import { generateNotFoundMessage } from './lib/generate-not-found-message'
import { NotFoundError } from './not-found-error'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'FileNotFoundError'
const defaultResource = 'file'
const myDefaults = { resource : defaultResource }

/**
 * A {@link NotFoundError} sub-type indicating there is no file at the requested location. If both `dirPath` and
 * `fileName` are specified, `FileNotFound` tries to be smart about joining them and will try and guess the proper path
 * separator and whether it needs to be appended or not.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link DirectoryNotFoundError}
 * - {@link NotFoundError}
 * @category Not found errors
 */
const FileNotFoundError = class extends NotFoundError {
  /**
   * {@link FileNotFoundError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.dirPath = undefined] - The directory (not including the file itself) where the
   *   file is located.
   * @param {string|undefined} [options.fileName = undefined] - The name of the file itself. May be a full path (in
   *   which case `dirPath` should be left undefined) or just the file name, in which case it is combined with
   *   `dirPath`, if present, to create the standard error message.
   * @param {string|undefined} [options.resource = undefined] - Should usually be left undefined. If set, then the
   *   value will override `fileName` and `dirPath` and be used to generate the standard message if `message` option
   *   not set.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new FileNotFound() // "File not found."
   * new FileNotFound({ fileName: 'foo.txt' }) // "File 'foo.txt' not found."
   * new FileNotFound({ dirPath: '/tmp', fileName: 'foo.txt'}) // "File '/tmp/foo.txt' not found."
   * new FileNotFound({ dirPath: '/tmp/', fileName: 'foo.txt'}) // "File '/tmp/foo.txt' not found."
   * new FileNotFound({ dirPath: '/this-is-weird' }) // "File in directory '/this-is-weird' not found."
   */
  constructor({ name = myName, ...options } = {}, defaults) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.resource =
      options.resource || describeFile(options) || defaultResource
    options.message =
      options.message || generateNotFoundMessage(options, defaults)

    super({ name, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(FileNotFoundError).name)

FileNotFoundError.typeName = myName

export { FileNotFoundError }
