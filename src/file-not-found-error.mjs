import { generateNotFoundMessage } from './lib/generate-not-found-message'
import { NotFoundError } from './not-found-error'
import { registerParent } from './map-error-to-http-status'
import { describeFile } from './lib/describe-file'

const myName = 'FileNotFoundError'

/**
 * A {@link NotFoundError} sub-type indicating there is no file at the requested location. If both `dirPath` and
 * `fileName` are specified, `FileNotFound` tries to be smart about joining them and will try and guess the proper path
 * separator and whether it needs to be appended or not.
 * @param {string|undefined} dirPath - The directory (not including the file itself) where the file is located.
 * @param {string|undefined} fileName - The name of the file itself. May be a full path (in which case `dirPath` should
 *   be left undefined) or just the file name, in which case it is combined with `dirPath`, if present, to create the
 *   standard error message.
 * @param {string|undefined} resource - Should usually be left undefined. If set, then the value will override
 *   `fileName` and `dirPath` and be used to generate the standard message if `message` option not set.
 * @example
 * new FileNotFound() // "File not found."
 * new FileNotFound({ fileName: 'foo.txt' }) // "File 'foo.txt' not found."
 * new FileNotFound({ dirPath: '/tmp', fileName: 'foo.txt'}) // "File '/tmp/foo.txt' not found."
 * new FileNotFound({ dirPath: '/tmp/', fileName: 'foo.txt'}) // "File '/tmp/foo.txt' not found."
 * new FileNotFound({ dirPath: '/this-is-weird' }) // "File in directory '/this-is-weird' not found."
 */
const FileNotFoundError = class extends NotFoundError {
  constructor ({ name = myName, ...options } = {}) {
    const resource = describeFile(options)
    options.resource = options.resource || resource
    options.message = options.message || generateNotFoundMessage({ resource })

    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(FileNotFoundError).name)

FileNotFoundError.typeName = myName

export { FileNotFoundError }
