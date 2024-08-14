import { IoError } from './io-error'

const name = 'EndOfStreamError'

/**
 * An {@link IoError} sub-type indicating an attempt to read beyond the of a stream.
 */
const EndOfStreamError = class extends IoError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

EndOfStreamError.typeName = name

export { EndOfStreamError }