import { generateNotFoundMessage } from './generate-not-found-message'

const generateNoAccessMessage = ({ resource, status }) => {
  if (status === 404) {
    return generateNotFoundMessage({ resource })
  }
  else {
    return `Access ${resource === undefined ? '' : `to ${resource} `}is denied.`
  }
}

export { generateNoAccessMessage }
