/* globals AuthenticationRequiredError CommonError NoAccessError OperationNotPermittedError */ // used in the docs
import { AuthError } from './auth-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'AuthorizationConditionsNotMetError'

/**
 * An {@link AuthError} indicating that the user is authorized to perform some action under some circumstances, but
 * additional conditions must be met. The blocking or necessary conditions should be described if possible.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link AuthenticationRequiredError} - Use this when the resource requires authenticated access and the user is not
 *   currently authenticated.
 * - {@link NoAccessError} - Use this when the user is accessing a resource the user has no authorizations to.
 * - {@link OperationNotPermittedError} - Use this when user is attempting an operation for which they have no
 *   authorization.
 */
const AuthorizationConditionsNotMetError = class extends AuthError {
  /**
   * Constructor for the {@link AuthorizationConditionsNotMetError}.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object|undefined} options - The constructor options.
   * @param {string|undefined} options.action - A description of the action being taken. This should identify the target
   *   resource/entity where appropriate. E.g., 'accessing the database' or 'updating customer data'.
   * @param {string|undefined} options.hint - A description of what the user might do to remedy the situation. This
   *   should be a complete sentence. E.g., 'You may contact customer service and request a quota increase.', or 'Try
   *   again in a few minutes.'
   * @param {string|undefined} options.issue - A description of the problem. E.g., 'the user is over request quota', or
   *   'this operation is only allowed between 0900 and 1700'.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * new AuthorizationConditionsNotMet() // "While generally authorized, current conditions prevent this action."
   * // v "While generally authorized to access customer data, current conditions prevent this action."
   * new AuthorizationConditionsNotMet({ action: 'access customer data' })
   * // v "While generally authorized, user is over rate quota."
   * new AuthorizationConditionsNotMet({ issue: 'user is over rate quota' })
   * // v "While generally authorized to access customer data, user is over rate quota."
   * new AuthorizationConditionsNotMet({ action: 'access customer data', issue: 'user is over rate quota' })
   * // v "While generally authorized, current conditions prevent this action. Try again in a few minutes."
   * new AuthorizationConditionsNotMet({ hint: 'Try again in a few minutes.' })
   */
  constructor({ name = myName, ...options } = {}) {
    if (options.message === undefined) {
      options.message = generateMessage(options)
    }
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(AuthorizationConditionsNotMetError).name)

AuthorizationConditionsNotMetError.typeName = myName

const generateMessage = ({ action, hint, issue = 'current conditions prevent this action' }) => {
  let message = 'While generally authorized'
  if (action !== undefined) {
    message += ` to ${action}`
  }
  message += `, ${issue}.`
  if (hint !== undefined) {
    message += ' ' + hint
  }

  return message
}

export { AuthorizationConditionsNotMetError }
