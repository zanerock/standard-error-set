/* globals CommonError */
import { describeFile } from './lib/describe-file'
import { IoError } from './io-error'
import { generateIoErrorMessage } from './lib/generate-io-error-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'FileLoadError'

/**
 * An {@link IoError} indicating a file is present, and can be read, but there is a problem loading it.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link IoError}
 * - {@link FileLoadError}
 */
const FileLoadError = class extends IoError {
  /**
   * {@link FileLoadError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.action = 'loading'] - A description of the action being taken. Default to 'loading'.
   * @param {string|undefined} [options.dirPath = undefined] - The directory (not including the file itself) where the
   *   file is located.
   * @param {string|undefined} [options.fileName = undefined] - The name of the file itself. May be a full path (in
   *   which case `dirPath` should be left undefined) or just the file name, in which case it is combined with
   *   `dirPath`, if present, to create the standard error message.
   * @param {string|undefined} [options.issue = undefined] - Describes the specific issue.
   * @param {string|undefined} [options.target = undefined] - The name or description of the target resource. Should
   *   generally be left in preference for setting `fileName` and/or `filePath`.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new FileLoadError() // "There was an error error while loading the file."
   * new FileLoadError({ action : 'reading' }) // "There was an error while reading the file."
   * new FileLoadError({ fileName : 'foo.txt' }) // "There an error while loading the file 'foo.txt'."
   * // v "There an error while loading the file '/bar/foo.txt'."
   * new FileLoadError({ dirPath : '/bar', fileName: 'foo.txt' })
   * // v "There an error while loading a file in directory '/bar'; virtual socket closed."
   * new FileLoadError({ issue : 'virtual socket closed', dirPath : '/bar' })
   */
  constructor({ name = myName, action = 'loading', ...options } = {}) {
    options.target = options.target || describeFile({ action, ...options })
    options.message = options.message || generateIoErrorMessage('an error', options)
    super({ name, action, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(FileLoadError).name)

FileLoadError.typeName = myName

export { FileLoadError }
