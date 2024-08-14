import { DataServiceError } from './data-service-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'RollbackError'

/**
 * A {@link DataServiceError} relating to a failed rollback attempt on an external data service. Use {@link
 * LocalRollbackError} within a database implementation itself.
 */
const RollbackError = class extends DataServiceError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(RollbackError).name)

RollbackError.typeName = myName

export { RollbackError }
