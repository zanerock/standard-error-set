import { CommonError } from './common-error'

const name = 'IoError'

/**
 * A generic local I/O error _not_ involving a missing resource. Note that `IoError`s are specifically locally and  
 * external service, or remote connections errors are therefore not I/O errors.
 */
const IoError = class extends CommonError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

IoError.typeName = name

export { IoError }