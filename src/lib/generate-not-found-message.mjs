import { includeParameterInMessage } from './include-parameter-in-message'

/* globals NotFoundError NoAccessError */ // used in docs
/**
 * Generates an error message for a 'not found' resource. This is a library function (rather than an in-Class helper)
 * because we want to make sure the message stays coordinated between "true" {@link NotFoundError}s and 'hidden' {@link
 * NoAccessError}s.
 * @param {object|undefined} options - The message options.
 * @param {object|undefined} [options.resource = undefined] - The name or short description of the missing resource.
 * @param {object} defaults - Default parameter values to use if the parameter is not included in the message.
 * @returns {string} The 'X not found' message.
 * @private
 */
const generateNotFoundMessage = (options, defaults) => {
  let { resource } = options
  if (includeParameterInMessage('resource', options) === false) {
    resource = defaults.resource
  }

  resource = resource.charAt(0).toUpperCase() + resource.slice(1)

  return `${resource} not found.`
}

export { generateNotFoundMessage }
