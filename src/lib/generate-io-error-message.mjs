const generateIoErrorMessage = (errorType = 'an IO', { action, issue, target }) => {
  let message = `There was ${errorType} error ${action}`
  if (target !== undefined) {
    message += ` the ${target}`
  }
  if (issue !== undefined) {
    message += `; ${issue}`
  }
  message += '.'

  return message
}

export { generateIoErrorMessage }
