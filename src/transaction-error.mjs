import { DataServiceError } from './data-service-error'

const name = 'TransactionError'

/**
 * A {@link DataServiceError} indicating a problem with creating or working with a transaction. Note, this error is 
 * specifically for problems arising with an external data service; use {@link LocalTransactionError} for error or 
 * otherwise involving a transaction within a database system itself.
 */
const TransactionError = class extends DataServiceError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

TransactionError.typeName = name

export { TransactionError }