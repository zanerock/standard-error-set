import { mapErrorsToHTTPStatus } from './map-errors-to-http-status'
import { mapHTTPStatusToName } from './lib/map-http-status-to-name'

const name = 'InvalidArgumentError'

const InvalidArgumentError = class extends Error {
  constructor (functionName, argumentName, argumentValue, options) {
    const trivialMessage = 'Function called with invalid arguments.'
    if (functionName === undefined) {
      super(trivialMessage)
      options = {}
    } else if (typeof functionName === 'object') {
      options = functionName || {} // we do this because 'null' has typeof 'object'
      super(options.message || trivialMessage, options)
    } else if (argumentName === undefined || typeof argumentName === 'object') {
      options = argumentName || {}
      super(`Function '${functionName}' called with invalid arguments.`, options)
    } else if (argumentValue === undefined || typeof argumentValue === 'object') {
      options = argumentValue || {}
      super(`Function '${functionName}' argument '${argumentName}' is invalid.`, options)
    } else {
      options = options || {}
      super(`Function '${functionName}' argument '${argumentName}' has invalid value '${argumentValue}'.`, options)
    }

    this.name = name
    this.status = options.status || mapErrorsToHTTPStatus(this.name)
    this.statusName = mapHTTPStatusToName(this.status)
  }
}

InvalidArgumentError.typeName = name

export { InvalidArgumentError }
