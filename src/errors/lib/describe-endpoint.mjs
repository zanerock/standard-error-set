import { includeParameterInMessage } from '../../util/include-parameter-in-message'

const describeEndpoint = (options, defaults) => {
  const { endpointType, endpointName, packageName } = options

  let message = includeParameterInMessage('endpointType', options)
    ? endpointType
    : defaults.endpointType

  message = message.charAt(0).toUpperCase() + message.slice(1) + ' '

  if (includeParameterInMessage('packageName', options)) {
    message +=
      endpointName === undefined
        ? `in package '${packageName}' `
        : `'${packageName}#`
  }
  if (includeParameterInMessage('endpointName', options)) {
    message += `${packageName === undefined ? "'" : ''}${endpointName}()' `
  }

  return message
}

export { describeEndpoint }