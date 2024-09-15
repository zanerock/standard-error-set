import { CommonError } from './common-error'
import { includeParameterInMessage } from '../util/include-parameter-in-message'
import { registerParent } from '../settings/map-error-to-http-status'

const myName = 'SystemError'
const defaultIssue = 'has experienced a system error'
const defaultResource = 'the process'
const myDefaults = { issue : defaultIssue, resource : defaultResource }

/**
 * An error indicating a system error. When used to wrap native system errors (like `ReferenceError`, `SyntaxError`,
 * etc.), be sure to set the `cause` option.
 */
const SystemError = class extends CommonError {
  /**
   * {@link SystemError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.issue = 'has experienced a system error'] - A description of the error.
   * @param {string} [options.resource = 'process'] - The name or short description of the resource where the error
   *   occurred.
   {{> common-hidden-parameters }}
   * @example
   * new SystemError() // "The process has experienced a System."
   * // v "The application has experienced a stack overflow."
   * new SystemError({ resource: 'application'})
   * @category General errors
   */
  constructor(
    {
      name = myName,
      issue = defaultIssue,
      resource = defaultResource,
      ...options
    } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message
      || generateMessage({ issue, resource, ...options }, defaults)
    super({ name, issue, resource, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(SystemError).name)

const generateMessage = (options, defaults) => {
  let { issue, resource } = options
  resource = includeParameterInMessage('resource', options)
    ? resource
    : defaults.resource
  issue = includeParameterInMessage('issue', options) ? issue : defaults.issue

  return `${resource.charAt(0).toUpperCase() + resource.slice(1)} ${issue}.`
}

SystemError.typeName = myName

export { SystemError }
