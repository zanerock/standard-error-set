import { DataServiceError } from './data-service-error'

const name = 'RollbackError'

/**
 * A {@link DataServiceError} relating to a failed rollback attempt on an external data service. Use {@link 
 * LocalRollbackError} within a database implementation itself.
 */
const RollbackError = class extends DataServiceError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

RollbackError.typeName = name

export { RollbackError }