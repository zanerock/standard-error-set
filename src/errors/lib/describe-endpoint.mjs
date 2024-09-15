import { includeParameterInMessage } from '../../util/include-parameter-in-message'

const describeEndpoint = (options, defaults, capitalize = true) => {
  const { endpointType, endpointName, packageName } = options

  let message = includeParameterInMessage('endpointType', options) === true
    ? endpointType
    : defaults.endpointType

  if (capitalize === true) {
    message = message.charAt(0).toUpperCase() + message.slice(1)
  }
  message += ' '

  const includeEndpointName = includeParameterInMessage('endpointName', options)

  if (includeParameterInMessage('packageName', options) === true) {
    message +=
      endpointName === undefined
        ? `in package '${packageName}' `
        : `'${packageName}#`
  }
  
  if (includeEndpointName ===  true) {
    message += `${packageName === undefined ? "'" : ''}${endpointName}'`
  }

  return message.trim()
}

export { describeEndpoint }