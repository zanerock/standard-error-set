/* global LocalTransactionError */ // used in documentation
import { DataServiceError } from './data-service-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'TransactionError'

/**
 * A {@link DataServiceError} indicating a problem with creating or working with a transaction. Note, this error is
 * specifically for problems arising with an external data service; use {@link LocalTransactionError} for error or
 * otherwise involving a transaction within a database system itself.
 */
const TransactionError = class extends DataServiceError {
  constructor ({ name = myName, ...options } = {}) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(TransactionError).name)

TransactionError.typeName = myName

export { TransactionError }
