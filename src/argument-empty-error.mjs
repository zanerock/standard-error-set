import { InvalidArgumentError } from './invalid-argument-error'

const name = 'ArgumentMissingError'

/**
 * A {@link InvalidArgumentError} sub-type indicating an argument is missing or empty (typically `null', `undefined`, 
 * or '').
 */
const ArgumentMissingError = class extends InvalidArgumentError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

ArgumentMissingError.typeName = name

export { ArgumentMissingError }