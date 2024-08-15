import { ArgumentInvalidError } from './argument-invalid-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'ArgumentMissingError'

/**
 * A {@link ArgumentInvalidError} sub-type indicating an argument is missing or empty (typically `null', `undefined`,
 * or '').
 */
const ArgumentMissingError = class extends ArgumentInvalidError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentMissingError).name)

ArgumentMissingError.typeName = myName

export { ArgumentMissingError }
