import { IoError } from './io-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'EndOfStreamError'

/**
 * An {@link IoError} sub-type indicating an attempt to read beyond the of a stream.
 */
const EndOfStreamError = class extends IoError {
  constructor ({ name = myName, ...options } = {}) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(EndOfStreamError).name)

EndOfStreamError.typeName = myName

export { EndOfStreamError }
