import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'IoError'

/**
 * A generic local I/O error _not_ involving a missing resource. Note that `IoError`s are specifically locally and
 * external service, or remote connections errors are therefore not I/O errors.
 */
const IoError = class extends CommonError {
  constructor ({ name = myName, ...options } = {}) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(IoError).name)

IoError.typeName = myName

export { IoError }
