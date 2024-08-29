import { includeParameterInMessage } from '../include-parameter-in-message'

const generateAuthMessage = (options, defaults) => {
  const { issue, target } = options
  let { action } = options

  action = includeParameterInMessage('action', options)
    ? action
    : defaults.action

  let message = action.charAt(0).toUpperCase() + action.slice(1)
  if (includeParameterInMessage('target', options)) {
    message += ` the ${target}`
  }
  message += ` ${includeParameterInMessage('issue', options) ? issue : defaults.issue}.`

  return message
}

export { generateAuthMessage }
