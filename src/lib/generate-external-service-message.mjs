const generateExternalServiceMessage = (errorType, { issue, service }) => {
  let message = `There was ${errorType || 'an'} error with the remote ${service} service`
  if (issue !== undefined) {
    message += `; service ${issue}`
  }
  message += '.'

  return message
}

export { generateExternalServiceMessage }
