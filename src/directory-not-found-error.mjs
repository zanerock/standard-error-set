import { describeDirectory } from './lib/describe-directory'
import { generateNotFoundMessage } from './lib/generate-not-found-message'
import { NotFoundError } from './not-found-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'DirectoryNotFoundError'

/**
 * A {@link NotFoundError} sub-type indicating there is no file at the requested location. If both `dirPath` and
 * `fileName` are specified, `DirectoryNotFound` tries to be smart about joining them and will try and guess the proper path
 * separator and whether it needs to be appended or not.
 * @param {string|undefined} dirPath - The directory (not including the file itself) where the file is located.
 * @param {string|undefined} resource - Should usually be left undefined. If set, then the value will override
 *   `dirPath` and be used to generate the standard message if `message` option not set.
 * @example
 * new DirectoryNotFound() // "Directory not found."
 * new DirectoryNotFound({ dirPath: '/my-dir' }) // "Directory '/my-dir' not found."
 */
const DirectoryNotFoundError = class extends NotFoundError {
  constructor ({ name = myName, ...options } = {}) {
    const resource = describeDirectory(options)
    options.message = options.message || generateNotFoundMessage({ resource })
    options.resource = options.resource || resource

    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(DirectoryNotFoundError).name)

DirectoryNotFoundError.typeName = myName

export { DirectoryNotFoundError }
