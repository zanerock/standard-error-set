/* globals EndOfStreamError FileLoadError */ // used in docs
import { CommonError } from '../common-error'
import { generateIoErrorMessage } from './lib/generate-io-error-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'IoError'
const defaultAciton = 'accessing'
const defaultTarget = 'resource'
const myDefaults = { action : defaultAciton, target : defaultTarget }

/**
 * A generic local I/O error _not_ involving a missing resource. Note that `IoError`s are specifically locally and
 * external service, or remote connections errors are therefore not I/O errors.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link EndOfStreamError}
 * - {@link FileLoadError}
 * @category IO errors
 */
const IoError = class extends CommonError {
  /**
   * {@link IoError} constructor.
   * 
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.action = undefined] - A description of the action being taken. E.g., 'reading'
   *   or 'writing'. Defaults to 'accessing'.
   * @param {string|undefined} [options.issue = undefined] - Describes the specific issue.
   * @param {string|undefined} [options.target = undefined] - The name or description of the target resource.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new IoError() // "There was an IO error."
   * new IoError({ action : 'reading' }) // "There was an IO error while reading."
   * new IoError({ target : 'serial port' }) // "There an IO error while accessing the serial port."
   * new IoError({ action: 'reading', target : 'serial port' }) // "There an IO error while reading the serial port."
   * // v "There an IO error while accessing the serial port; virtual socket closed."
   * new IoError({ issue : 'virtual socket closed', target : 'serial port' })
   */
  constructor(
    { name = myName, action = defaultAciton, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message
      || generateIoErrorMessage('an IO', { action, ...options }, defaults)
    super({ name, action, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(IoError).name)

IoError.typeName = myName

export { IoError }
