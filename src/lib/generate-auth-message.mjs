const generateAuthMessage = (issue, { action, target }) => {
  let message = action.charAt(0).toUpperCase() + action.slice(1)
  if (target !== undefined) {
    message += ` the ${target}`
  }
  message += ` ${issue}.`

  return message
}

export { generateAuthMessage }
