/* global CommonError NotImplementedError NotSupportedError */ // used in docs
import { ExternalServiceError } from './external-service-error'
import { includeParameterInMessage } from '../../util/include-parameter-in-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'UnavailableError'
const defaultIssue = 'currently unavailable'
const defaultTarget = 'target resource'
const myDefaults = { issue : defaultIssue, target : defaultTarget }

/**
 * An error indicating that the resource exists, but is not currently available. This represents a temporary condition.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link NotImplementedError} - Use this when the target is not implemented at all.
 * - {@link NotSupportedError} - Use this when the target is implemented, but doesn't support some requested feature.
 * @category External service errors
 */
const UnavailableError = class extends ExternalServiceError {
  /**
   * {@link UnavailableError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - The constructor options.
   * @param {string|undefined} [options.expectedTime = undefined] - A short description as to when the resource might be
   *   available. E.g., 'after 1400' or 'in two hours'.
   * @param {string} [options.issue = 'currently unavailable'] -
   * @param {string} [options.target = 'target resource'] - The name of the function, endpoint, service, etc. which the
   *   user is trying to invoke. E.g., '/some/url/endpoint' or 'myFunction()'
   {{> common-hidden-parameters }}
   * @example
   * new UnavailableError() // "The target resource is currently unavailable.
   * new UnavailableError({ target: 'URL /some/endpoint'}) // "The URL /some/endpoint is not currently available."
   * // v "The customer DB is offline for maintenance."
   * new UnavailableError({ target: 'customer DB', issue: 'offline for maintenance' })
   * // v "The URL /some/endpoint is not currently available; try again after 12:00 Saturday.'
   * new UnavailableError({ target: 'URL /some/endpoint', expectedTime: 'after 12:00 Saturday' })
   */
  constructor(
    {
      name = myName,
      issue = defaultIssue,
      target = defaultTarget,
      ...options
    } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message
      || generateMessage({ issue, target, ...options }, defaults)
    super({ name, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(UnavailableError).name)

UnavailableError.typeName = myName

const generateMessage = (options, defaults) => {
  let { expectedTime, issue, target } = options

  target =
    includeParameterInMessage('target', options) === true
      ? target
      : defaults.target
  issue =
    includeParameterInMessage('issue', options) === true
      ? issue
      : defaults.issue

  let message = `The ${target} is ${issue}`
  message += includeParameterInMessage('expectedTime', options)
    ? `; try again ${expectedTime}.`
    : '.'

  return message
}

export { UnavailableError }
