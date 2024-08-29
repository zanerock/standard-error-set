/* globals CommonError */ // ref in docs
import { AuthError } from './auth-error'
import { includeParameterInMessage } from './lib/include-parameter-in-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'BadCredentialsError'
const defaultAction = 'authentication'
const myDefaults = { action : defaultAction }

/**
 * An {@link AuthError} sub-class indicating the provided credentials are invalid.
 */
const BadCredentialsError = class extends AuthError {
  /**
   * {@link BadCredentialsError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.action = 'authentication'] - A short description of the action.
   * @param {string|undefined} [options.issue = undefined] - Additional specifics regarding the issue.
   * @param {string|undefined} [options.method = undefined] - The authentication method. E.g., 'password', 'SSL cert',
   *   etc.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new BadCredentialsError() // "Authentication failed."
   * new BadCredentialsError({ method: 'password' }) // "Authentication of password failed."
   * new BadCredentialsError({ action : 'decoding', method: 'SSL cert' }) // "Decoding of SSL cert failed."
   * new BadCredentialsError({ issue: 'certificate not signed' }) // "Authentication failed; certificate not signed."
   */
  constructor(
    { name = myName, action = defaultAction, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message || generateMessage({ action, ...options }, defaults)
    super({ name, action, ...options }, defaults)
  }
}

const generateMessage = (options, defaults) => {
  let { action } = options
  const { issue, method } = options

  action = includeParameterInMessage('action', options)
    ? action
    : defaults.action

  let message = action.charAt(0).toUpperCase() + action.slice(1)
  if (includeParameterInMessage('method', options)) {
    message += ` of ${method}`
  }

  message += ' failed'

  if (includeParameterInMessage('issue', options)) {
    message += `; ${issue}.`
  }
  else {
    message += '.'
  }

  return message
}

registerParent(myName, Object.getPrototypeOf(BadCredentialsError).name)

BadCredentialsError.typeName = myName

export { BadCredentialsError }
