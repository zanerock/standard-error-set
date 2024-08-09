import { mapErrorsToHTTPStatus } from './map-errors-to-http-status'
import { mapHTTPStatusToName } from './lib/map-http-status-to-name'
/* import { generateErrorClass } from './generate-error-class'

const args = ['functionName', 'argumentName', 'argumentValue', 'options']

const generateMessage = function () {
  const trivialMessage = 'Function called with invalid arguments.'
  if (this.functionName === undefined) {
    return trivialMessage
  } else if (typeof this.functionName === 'object') {
    return this.options.message || trivialMessage
  } else if (this.argumentName === undefined || typeof this.argumentName === 'object') {
    return `Function '${this.functionName}' called with invalid arguments.`
  } else if (this.argumentValue === undefined || typeof this.argumentValue === 'object') {
    return `Function '${this.functionName}' argument '${this.argumentName}' is invalid.`
  } else {
    return `Function '${this.functionName}' argument '${this.argumentName}' has invalid value '${this.argumentValue}'.`
  }
}

const InvalidArgumentError = generateErrorClass('InvalidArgumentError', { args, generateMessage, globalize : false })
*/
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
