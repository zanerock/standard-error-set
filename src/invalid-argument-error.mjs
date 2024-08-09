import { mapErrorsToHTTPStatus } from './map-errors-to-http-status'
import { mapHTTPStatusToName } from './lib/map-http-status-to-name'

const name = 'InvalidArgumentError'

const InvalidArgumentError = class extends Error {
  constructor (functionName, argumentName, argumentValue, options) {
    options = arguments[arguments.length - 1] || {}
    const trivialMessage = 'Function called with invalid arguments.'
    if (functionName === undefined) {
      super(trivialMessage)
    } else if (typeof functionName === 'object') {
      super(options.message || trivialMessage, options)
    } else if (argumentName === undefined || typeof argumentName === 'object') {
      super(`Function '${functionName}' called with invalid arguments.`, options)
    } else if (argumentValue === undefined || typeof argumentValue === 'object') {
      super(`Function '${functionName}' argument '${argumentName}' is invalid.`, options)
    } else {
      super(`Function '${functionName}' argument '${argumentName}' has invalid value '${argumentValue}'.`, options)
    }

    this.name = name
    this.status = options.status || mapErrorsToHTTPStatus(this.name)
    this.statusName = mapHTTPStatusToName(this.status)
  }
}

InvalidArgumentError.typeName = name

export { InvalidArgumentError }
