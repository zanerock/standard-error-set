import { CommonError } from './common-error'

const name = 'UniqueConstraintViolationError'

const UniqueConstraintViolationError = class extends CommonError {
  constructor ({ entityType, fieldAndValues, message, ...options }) {
    message = message || generateMessage(entityType, fieldAndValues)

    super(name, message, options)
    this.entityType = entityType
    this.fieldAndValues = fieldAndValues
  }
}

const generateMessage = (entityType, fieldAndValues) => {
  let message = 'Unique constraint '
  if (fieldAndValues !== null && fieldAndValues.length > 0) {
    message += 'on fields <'
    for (const fieldAndValue of fieldAndValues) {
      if (Array.isArray(fieldAndValue) && fieldAndValue.length === 2) {
        const [field, value] = fieldAndValue
        message += `${field}(${value}),`
      } else {
        message += `${field},`
      }
    }
    message = message.slice(-1)
    message += '> '
  }
  if (entityType !== undefined) {
    message += `on entity type ${entityType} `
  }
  message += 'violated.'
}

UniqueConstraintViolationError.typeName = name

export { UniqueConstraintViolationError }
