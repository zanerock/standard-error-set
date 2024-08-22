const generateConstraintMessage = ({ constraintType, entityType, fieldAndValues }) => {
  let message = constraintType.charAt(0).toUpperCase() + constraintType.slice(1)
  if (!constraintType.endsWith('constraint')) {
    message += ' constraint'
  }
  if (fieldAndValues.length > 0) {
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
  if (entityType !== undefined) {
    message += ` on entity type '${entityType}'`
  }
  message += ' violated.'

  return message
}

export { generateConstraintMessage }
