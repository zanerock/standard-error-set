const generateIoErrorMessage = (errorType = 'an IO', { action = 'accessing', issue, target }) => {
  let message = `There was ${errorType} error`
  if (action !== undefined) {
    message += ` while ${action}`
  }
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
