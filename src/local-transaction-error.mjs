import { IoError } from './io-error'

const name = 'LocalTransactionError'

/**
 * An {@link IoError} indicating a problem creating or otherwise involving a transaction within a database system 
 * itself. Use {@link TransactionError} for transaction errors related to transactions in an external database service.
 */
const LocalTransactionError = class extends IoError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

LocalTransactionError.typeName = name

export { LocalTransactionError }