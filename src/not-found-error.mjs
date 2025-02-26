/* globals DirectoryNotFoundError FileNotFoundError NoAccessError OperationNotPermittedError */ // used in docs
import { CommonError } from './common-error'
import { generateNotFoundMessage } from './lib/generate-not-found-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'NotFoundError'
const defaultResource = 'resource'
const myDefaults = { resource : defaultResource }

/**
 * An error indicating a resource or entity cannot be found. This error is used with local and remote resources/entities
 * where the fundamental issue is the named thing not being present.
 *
 * Consider whether any of the following errors might be more precise or better suited:
 * - {@link DirectoryNotFoundError}
 * - {@link FileNotFoundError}
 * - {@link NoAccessError} and sub-classes where the issue is related to resource authorizations.
 * - {@link OperationNotPermittedError} where the issue is related to action authorizations (as opposed to resource
 *   authorizations)
 */
const NotFoundError = class extends CommonError {
  /**
   * {@link NotFoundError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string|undefined} [options.resource = undefined] - The name or short description of the missing resource.
   * @param {string} [options.code = 'ENOENT'] - The code to use with the error. Should generally be left to the
   *   default.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new NotFoundError() // "Resource not found."
   * new NotFoundError({ resource : 'the hidden garden' }) // "The hidden garden is not found."
   */
  constructor({ name = myName, code = 'ENOENT', ...options } = {}, defaults) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message || generateNotFoundMessage(options, defaults)
    super({ name, code, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(NotFoundError).name)

NotFoundError.typeName = myName

export { NotFoundError }
