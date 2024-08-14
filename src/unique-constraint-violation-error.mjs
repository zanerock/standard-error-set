import { ConstraintViolationError } from './constraint-violation-error'

const name = 'UniqueConstraintViolationError'

/**
 * A {@link ConstraintViolationError} ndicating violation of a unique constraint, such as login ID.
 * @param {object} options - The error options.
 * @param {string|undefined} options.entityType - The "type" of entity (e.g., 'user'; optional).
 * @param {string[]|Array.<Array.string>} options.fieldAndValues - An array of either field names and/or arrays of
 *   field name + field value (optional). You may mix and match, e.g., `['field1', ['field2', 'value2']`.
 * @param {string|undefined} options.message - The explicit error message to use (rather than generating an error
 *   message) (optional).
 * @param {number|undefined} options.status - The HTTP status code to use on this error instance (optional); will be
 *   mapped to default if not provided.
 * @param {object|undefined} options.options - The remainder of the options are passed to the `Error` super-constructor.
 */
const UniqueConstraintViolationError = class extends ConstraintViolationError {
  constructor ({ entityType, fieldAndValues, message, status, ...options } = {}) {
    message = message || generateMessage(entityType, fieldAndValues)

    super(name, message, { status, ...options })
    this.entityType = entityType
    this.fieldAndValues = fieldAndValues
  }
}

const generateMessage = (entityType, fieldAndValues) => {
  let message = 'Unique constraint '
  if (fieldAndValues !== undefined && fieldAndValues.length > 0) {
    message += 'on fields <'
    for (const fieldAndValue of fieldAndValues) {
      if (Array.isArray(fieldAndValue) && fieldAndValue.length === 2) {
        const [field, value] = fieldAndValue
        message += `${field}(${value}),`
      } else {
        message += `${fieldAndValue/* is just field */},`
      }
    }
    message = message.slice(0, -1)
    message += '> '
  }
  if (entityType !== undefined) {
    message += `on entity type '${entityType}' `
  }
  message += 'violated.'

  return message
}

UniqueConstraintViolationError.typeName = name

export { UniqueConstraintViolationError }
