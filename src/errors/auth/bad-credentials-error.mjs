/* globals CommonError */ // ref in docs
import { AuthError } from './auth-error'
import { includeParameterInMessage } from '../../util/include-parameter-in-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'BadCredentialsError'
const defaultAction = 'authentication'
const myDefaults = { action : defaultAction }

/**
 * An {@link AuthError} sub-class indicating the provided credentials are invalid.
 * @category Auth errors
 */
const BadCredentialsError = class extends AuthError {
  /**
   * {@link BadCredentialsError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.action = 'authentication'] - A short description of the action.
   * @param {string|undefined} [options.issue = undefined] - Additional specifics regarding the issue.
   * @param {string|undefined} [options.method = undefined] - The authentication method. E.g., 'password', 'SSL cert',
   *   etc.
   {{> common-hidden-parameters }}
   * @example
   * new BadCredentialsError() // "Authentication failed."
   * new BadCredentialsError({ method: 'password' }) // "Authentication using password failed."
   * new BadCredentialsError({ action : 'decoding', method: 'SSL cert' }) // "Decoding using SSL cert failed."
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
  const { action, issue, method } = options

  let message = action.charAt(0).toUpperCase() + action.slice(1)

  if (includeParameterInMessage('method', options)) {
    message += ` using ${method}`
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
