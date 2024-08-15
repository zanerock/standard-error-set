/**
 * Generates an error message for a 'not found' resource. This is a library function (rather than an in-Class helper) 
 * because we want to make sure the message stays coordinated between "true" {@link NotFoundError}s and 'hidden' {@link 
 * NoAccessError}s.
 * @param {object} options
 * @param {object} options.resource - The name or short description of the missing resource.
 * @private
 */
const generateNotFoundMessage = ({ resource }) => `Resource ${resource} not found.`

export { generateNotFoundMessage }