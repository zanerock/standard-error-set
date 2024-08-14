import { IoError } from './io-error'

const name = 'FileLoadError'

/**
 * An {@link IoError} indicating a file is present, and can be read, but there is a problem loading it.
 */
const FileLoadError = class extends IoError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

FileLoadError.typeName = name

export { FileLoadError }