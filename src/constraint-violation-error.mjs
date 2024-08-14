import { CommonError } from './common-error'

const name = 'ConstraintViolationError'

/**
 * Indicates the requested operation is well formed and the data otherwise correct, but it violates a data constraint. 
 * Consider 
 */
const ConstraintViolationError = class extends CommonError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

ConstraintViolationError.typeName = name

export { ConstraintViolationError }