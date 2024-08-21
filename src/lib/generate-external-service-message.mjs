const generateExternalServiceMessage = (serviceType, errorType, { issue, service }) => {
  let message = `There was ${errorType || 'an'} error with ${service === undefined ? 'a' : 'the'} remote`
  if (serviceType) {
    message += ` ${serviceType}`
  }
  message += ' service'
  if (service !== undefined) {
    message += ' ' + service
  }
  if (issue !== undefined) {
    message += `; service ${issue}`
  }
  message += '.'

  return message
}

export { generateExternalServiceMessage }
