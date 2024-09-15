/* globals CommonError FileNotFoundError */
import { describeDirectory } from '../lib/describe-directory'
import { generateNotFoundMessage } from './lib/generate-not-found-message'
import { NotFoundError } from './not-found-error'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'DirectoryNotFoundError'
const defaultResource = 'directory'
const myDefaults = { resource : defaultResource }

/**
 * A {@link NotFoundError} sub-type indicating there is no file at the requested location. If both `dirPath` and
 * `fileName` are specified, `DirectoryNotFound` tries to be smart about joining them and will try and guess the proper
 * path separator and whether it needs to be appended or not.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link FileNotFoundError}
 * - {@link NotFoundError}
 * @category Not found errors
 */
const DirectoryNotFoundError = class extends NotFoundError {
  /**
   * {@link DirectoryNotFoundError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.dirPath = undefined] - The directory (not including the file itself) where the
   *   file is located.
   * @param {string|undefined} [options.resource = undefined] - Should usually be left undefined. If set, then the
   *   value will override `dirPath` and be used to generate the standard message if `message` option not set.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   {{> common-hidden-parameters }}
   * @example
   * new DirectoryNotFound() // "Directory not found."
   * new DirectoryNotFound({ dirPath: '/my-dir' }) // "Directory '/my-dir' not found."
   */
  constructor({ name = myName, ...options } = {}, defaults) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.resource = options.resource || describeDirectory(options)
    options.message =
      options.message || generateNotFoundMessage(options, defaults)

    super({ name, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(DirectoryNotFoundError).name)

DirectoryNotFoundError.typeName = myName

export { DirectoryNotFoundError }
