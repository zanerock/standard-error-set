import { generateNotFoundMessage } from '../../not-found/lib/generate-not-found-message'
import { includeParameterInMessage } from '../../../util/include-parameter-in-message'

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
