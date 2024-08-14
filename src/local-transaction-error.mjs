import { IoError } from './io-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'LocalTransactionError'

/**
 * An {@link IoError} indicating a problem creating or otherwise involving a transaction within a database system
 * itself. Use {@link TransactionError} for transaction errors related to transactions in an external database service.
 */
const LocalTransactionError = class extends IoError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(LocalTransactionError).name)

LocalTransactionError.typeName = myName

export { LocalTransactionError }
