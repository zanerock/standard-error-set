import { IoError } from './io-error'

const name = 'LocalRollbackError'

/**
 * An {@link IoError} relating to a failed rollback within a database. Use {@link RollbackError} on the client side to 
 * indicate a failed rollback in an external data service.
 */
const LocalRollbackError = class extends IoError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

LocalRollbackError.typeName = name

export { LocalRollbackError }