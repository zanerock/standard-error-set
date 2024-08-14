import { CommonError } from './common-error'

const name = 'ExternalServiceError'

/**
 * Indicates an error related to an external service.
 */
const ExternalServiceError = class extends CommonError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

ExternalServiceError.typeName = name

export { ExternalServiceError }