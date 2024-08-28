import { includeParameterInMessage } from './include-parameter-in-message'

const generateConstraintMessage = (options, defaults) => {
  const { entityType, fieldAndValues } = options
  let { constraintType } = options

  constraintType = includeParameterInMessage('constraintType', options) ? constraintType : defaults.constraintType

  let message = constraintType.charAt(0).toUpperCase() + constraintType.slice(1)
  if (!constraintType.endsWith('constraint')) {
    message += ' constraint'
  }

  if (includeParameterInMessage('fieldAndValues', options)) {
    message += ' on fields <'
    for (const fieldAndValue of fieldAndValues) {
      if (Array.isArray(fieldAndValue) && fieldAndValue.length === 2) {
        const [field, value] = fieldAndValue
        message += `${field}(${value}),`
      }
      else {
        message += `${fieldAndValue/* is just field */},`
      }
    }
    message = message.slice(0, -1)
    message += '>'
  }
  if (includeParameterInMessage('entityType', options)) {
    message += ` on entity type '${entityType}'`
  }
  message += ' violated.'

  return message
}

export { generateConstraintMessage }
