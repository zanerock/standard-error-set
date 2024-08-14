import { IoError } from './io-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'LocalRollbackError'

/**
 * An {@link IoError} relating to a failed rollback within a database. Use {@link RollbackError} on the client side to
 * indicate a failed rollback in an external data service.
 */
const LocalRollbackError = class extends IoError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(LocalRollbackError).name)

LocalRollbackError.typeName = myName

export { LocalRollbackError }
