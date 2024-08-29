import { generateNotFoundMessage } from './generate-not-found-message'
import { includeParameterInMessage } from '../include-parameter-in-message'

const generateNoAccessMessage = (options, defaults) => {
  const { resource, status } = options

  if (status === 404) {
    return generateNotFoundMessage(options, defaults)
  }
  else {
    return `Access to ${includeParameterInMessage('resource', options) ? resource : defaults.resource} is denied.`
  }
}

export { generateNoAccessMessage }
