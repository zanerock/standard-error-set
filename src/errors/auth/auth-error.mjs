/* globals AuthenticationRequiredError BadCredentialsError NoAccessError OperationNotPermittedError */
import { CommonError } from '../common-error'
import { describeEndpoint } from '../lib/describe-endpoint'
import { includeParameterInMessage } from '../../util/include-parameter-in-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'AuthError'
const defaultAction = 'invoke'
const defaultEndpointType = 'action'
const defaultIssue = 'is not authorized'
const defaultSubject = 'user'
const myDefaults = { 
  action: defaultAction, 
  endpointType : defaultEndpointType, 
  issue : defaultIssue, 
  subject: defaultSubject
}

/**
 * A generic error indicating a problem with user authentication or authorization. `AuthError` should generally not be
 * used directly, but instead is intended as a base class for auth related errors allowing consumers to check for auth
 * related errors broadly (`e.g., instanceof AuthError`). Generally, will want to use one of the following:
 * - {@link AuthenticationRequiredError}
 * - {@link BadCredentialsError}
 * - {@link NoAccessError}
 * - {@link OperationNotPermittedError}
 * @category Auth errors
 */
const AuthError = class extends CommonError {
  /**
   * {@link AuthError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   {{> common-auth-parameters defaultAction='access' defaultIssue='is not authorized' defaultEndpointType='action'}}
   {{> common-hidden-parameters }}
   * @example
   * new AuthError() // "User is not authorized to invoke action."
   * new AuthError({ action : 'access', endpointType : 'URL' }) // "User is not authorized to access URL."
   * new AuthError({ issue : 'is not permitted' }) // User is not permitted to invoke action.
   */
  constructor(
    {
      name = myName,
      action = defaultAction,
      endpointType = defaultEndpointType,
      issue = defaultIssue,
      subject = defaultSubject,
      ...options
    } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    // fold the default options back in
    options = { action, endpointType, issue, subject, ...options }
    options.message =
      options.message
      || generateMessage(options, defaults)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(AuthError).name)

AuthError.typeName = myName

const generateMessage = (options, defaults) => {
  const { action, issue, subject } = options

  let message = includeParameterInMessage('subject', options) 
    ? subject 
    : defaults.subject
  message = subject.charAt(0).toUpperCase() + subject.slice(1) + ' '

  message += includeParameterInMessage('issue', options)
    ? issue
    : defaults.issue

  message += ' to ' 

  message += includeParameterInMessage('action', options)
    ? action
    : defaults.action

  message += ` ${describeEndpoint(options, defaults, false)}.`

  return message
}

export { AuthError }
