import { includeParameterInMessage } from '../include-parameter-in-message'

const generateIoErrorMessage = (errorType = 'an IO', options, defaults) => {
  const { action, issue, target } = options

  let message = `There was ${errorType} error ${includeParameterInMessage('action', options) ? action : defaults.action} the ${includeParameterInMessage('target', options) ? target : defaults.target}`
  if (includeParameterInMessage('issue', options)) {
    message += `; ${issue}`
  }
  message += '.'

  return message
}

export { generateIoErrorMessage }
