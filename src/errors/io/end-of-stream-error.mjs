/* globals CommonError */ // used in docs
import { IoError } from './io-error'
import { generateIoErrorMessage } from './lib/generate-io-error-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'EndOfStreamError'
const defaultAction = 'reading'
const defaultTarget = 'stream'
const myDefaults = { action : defaultAction, target : defaultTarget }

/**
 * An {@link IoError} sub-type indicating an attempt to read beyond the of a stream.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link EndOfStreamError}
 * - {@link IoError}
 */
const EndOfStreamError = class extends IoError {
  /**
   * {@link EndOfStreamError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.action = 'reading'] - A description of the action being taken; default to 'reading'.
   * @param {string|undefined} [options.issue = undefined] - Describes the specific issue.
   * @param {string|undefined} [options.target = undefined] - The name or description of the target resource.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new EndOfStreamError() // "There was an end-of-stream error."
   * new EndOfStreamError({ action : 'streaming' }) // "There was an end-of-stream error streaming."
   * new EndOfStreamError({ target : 'serial port' }) // "There was an end-of-stream error reading the serial port."
   * // v "There was an end-of-stream error streaming the serial port."
   * new EndOfStreamError({ action: 'streaming', target : 'serial port' })
   * // v "There was an end-of-stream error reading the serial port; virtual socket closed."
   * new EndOfStreamError({ issue : 'virtual socket closed', target : 'serial port' })
   */
  constructor(
    { name = myName, action = defaultAction, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message
      || generateIoErrorMessage(
        'an end-of-stream',
        { action, ...options },
        defaults
      )
    super({ name, action, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(EndOfStreamError).name)

EndOfStreamError.typeName = myName

export { EndOfStreamError }
