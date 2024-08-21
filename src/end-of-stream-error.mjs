/* globals CommonError */ // used in docs
import { IoError } from './io-error'
import { generateIoErrorMessage } from './lib/generate-io-error-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'EndOfStreamError'

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
   * @param {string|undefined} options.issue - Describes the specific issue.
   * @param {string|undefined} options.target - The name or description of the target resource.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new EndOfStreamError() // "There was an end-of-stream error."
   * new EndOfStreamError({ action : 'streaming' }) // "There was an end-of-stream error while streaming."
   * new EndOfStreamError({ target : 'serial port' }) // "There an end-of-stream error while reading the serial port."
   * // v "There an end-of-stream error streaming the serial port."
   * new EndOfStreamError({ action: 'streaming', target : 'serial port' })
   * // v "There an end-of-stream error reading the serial port; virtual socket closed."
   * new EndOfStreamError({ issue : 'virtual socket closed', target : 'serial port' })
   */
  constructor({ name = myName, action = 'reading', ...options } = {}) {
    options.message = options.message || generateIoErrorMessage('an end-of-stream', { action, ...options })
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(EndOfStreamError).name)

EndOfStreamError.typeName = myName

export { EndOfStreamError }
