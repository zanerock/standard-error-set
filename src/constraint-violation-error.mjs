import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'ConstraintViolationError'

/**
 * Indicates the requested operation is well formed and the data otherwise correct, but it violates a data constraint.
 * Consider
 */
const ConstraintViolationError = class extends CommonError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ConstraintViolationError).name)

ConstraintViolationError.typeName = myName

export { ConstraintViolationError }
