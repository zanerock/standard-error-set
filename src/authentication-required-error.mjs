import { AuthError } from './auth-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'AuthenticationRequiredError'

/**
 * An {@link AuthError} sub-class indicating that an operation requires an authenticated user and the current us not
 * authenticated.
 */
const AuthenticationRequiredError = class extends AuthError {
  /**
   * {@link AuthenticationRequiredError} constructor.
   * @param {object|undefined} options - Constructor options.
   * @param {string|undefined} options.action - A short description of the action requiring authentication.
   * @param {string|undefined} options.target - A short description of the action target.
   * @example
   * new AuthenticationRequiredError() // "Action requires authentication."
   * new AuthenticationRequiredError({ action : 'endpoint access' }) // "Endpoint access requires authentication."
   * // v "Updating the customer database requires authentication."
   * new AuthenticationRequiredError({ action : 'updating', target : 'customer database' })
   */
  constructor ({ name = myName, ...options } = {}) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(AuthenticationRequiredError).name)

AuthenticationRequiredError.typeName = myName

const generateMessage = ({ action = 'action', target }) => {
  let message = action.charAt(0).toUpperCase() + action.slice(1)
  if (target !== undefined) {
    message += ` the ${target}`
  }
  message += ' requires authentication.'

  return message
}

export { AuthenticationRequiredError }
