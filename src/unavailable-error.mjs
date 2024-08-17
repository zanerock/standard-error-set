/* global NotImplementedError NotSupportedError */ // used in docs
import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'UnavailableError'

/**
 * An error indicating that the resource exists, but is not currently available. This represents a temporary condition.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link NotImplementedError} - Use this when the target is not implemented at all.
 * - {@link NotSupportedError} - Use this when the target is implemented, but doesn't support some requested feature.
 */
const UnavailableError = class extends CommonError {
  /**
   * Constructor for {$link UnavailableError}.
   *
   * See the [common parameters](#common-parameters) note for additional parameters.
   * @param {object} options - The input options.
   * @param {string|undefined} options.expectedTime - A short description as to when the resource might be available. E.g., 'after 1400' or 'in two hours'.
   * @param {string|undefined} options.target - The name of the function, endpoint, service, etc. which the user is
   *   trying to invoke. E.g., '/some/url/endpoint' or 'myFunction()'
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * new UnavailableError() // "The target is currently unavailable.
   * // v "'/some/endpoint' is not currently available."
   * new UnavailableError({ target: '/some/endpoint'})
   * // v "'/some/endpoint' is not currently available, try again after 12:00 Saturday.'
   * new UnavailableError({ target: '/some/endpoint', expectedTime: 'after 12:00 Saturday' })
   */
  constructor ({ name = myName, ...options }) {
    options.message = options.message || generateMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(UnavailableError).name)

UnavailableError.typeName = myName

const generateMessage = ({ expectedTime, issue, target }) => {
  let message = target === undefined ? 'The target ' : `'${target}' `
  message += issue || 'is currently unavailable'
  message += expectedTime === undefined ? '.' : `, true again ${expectedTime}.`

  return message
}

export { UnavailableError }
