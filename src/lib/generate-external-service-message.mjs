import { includeParameterInMessage } from './include-parameter-in-message'

const generateExternalServiceMessage = (errorType, options, defaults) => {
  const { issue, service } = options

  let message = `There was ${errorType || 'an'} error with the remote ${includeParameterInMessage('service', options) ? service : defaults.service} service`
  if (includeParameterInMessage('issue', options)) {
    message += `; service ${issue}`
  }
  message += '.'

  return message
}

export { generateExternalServiceMessage }
