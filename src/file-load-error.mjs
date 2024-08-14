import { IoError } from './io-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'FileLoadError'

/**
 * An {@link IoError} indicating a file is present, and can be read, but there is a problem loading it.
 */
const FileLoadError = class extends IoError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(FileLoadError).name)

FileLoadError.typeName = myName

export { FileLoadError }
