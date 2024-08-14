import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'ExternalServiceError'

/**
 * Indicates an error related to an external service.
 */
const ExternalServiceError = class extends CommonError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ExternalServiceError).name)

ExternalServiceError.typeName = myName

export { ExternalServiceError }
