import { InvalidArgumentError } from './invalid-argument-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'ArgumentMissingError'

/**
 * A {@link InvalidArgumentError} sub-type indicating an argument is missing or empty (typically `null', `undefined`,
 * or '').
 */
const ArgumentMissingError = class extends InvalidArgumentError {
  constructor ({ name = myName, ...options }) {
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ArgumentMissingError).name)

ArgumentMissingError.typeName = myName

export { ArgumentMissingError }
