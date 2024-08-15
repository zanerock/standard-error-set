import { NotFoundError } from './not-found-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'FileNotFoundError'

/**
 * A {@link NotFoundError} sub-type indicating there is no file at the requested location. If both `dirPath` and 
 * `fileName` are specified, `FileNotFound` tries to be smart about joining them and will try and guess the proper path 
 * separator and whether it needs to be appended or not.
 * @param {string|undefined} dirPath - The directory (not including the file itself) where the file is located.
 * @param {string|undefined} fileName - The name of the file itself. May be a full path (in which case `dirPath` should 
 *   be left undefined) or just the file name, in which case it is combined with `dirPath`, if present, to create the 
 *   standard error message.
 * @example
 * new FileNotFound() // "File not found."
 * new FileNotFound({ fileName: 'foo.txt' }) // "File 'foo.txt' not found."
 * new FileNotFound({ dirPath: '/tmp', fileName: 'foo.txt'}) // "File '/tmp/foo.txt' not found."
 * new FileNotFound({ dirPath: '/tmp/', fileName: 'foo.txt'}) // "File '/tmp/foo.txt' not found."
 * new FileNotFound({ dirPath: '/this-is-weird' }) // "File in directory '/this-is-weird' not found."
 */
const FileNotFoundError = class extends NotFoundError {
  constructor ({ name = myName, ...options } = {}) {
    const resourceName = resolveFile(options)
    options.message = options.message || `File ${resourceName === undefined ? '' : `'${resourceName}' `}not found.`

    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(FileNotFoundError).name)

FileNotFoundError.typeName = myName

const resolveFile = ({ dirPath, fileName }) => {
  if (fileName !== undefined && dirPath !== undefined) {
    // this is not super robust and fails with a relative path that's just 'a-dir', but we want to avoid bloating the 
    // package with anything fancier.
    const sep = dirPath.includes('\\') ? '\\' : '/'
    return dirPath.endsWith(sep) ? `${dirPath}${fileName}` : `${dirPath}${sep}${fileName}`
  } else if (fileName !== undefined) {
    return `${fileName}` 
  } else if (dirPath !== undefined) {
    return `in directory '${dirPath}'`
  } // else
  return undefined
}

export { FileNotFoundError }
