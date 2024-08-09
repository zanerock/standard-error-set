const defaultMapping = {
  InvalidArgumentError : 400
}

const customMapping = {}

const mapErrorsToHttpStatus = (errorName, status) => {
  if (errorName === undefined) { // reset customMapping to default
    for (const prop in customMapping) {
      delete customMapping[prop]
    }
  } else if (errorName instanceof Error) {
    return customMapping[errorName.name] || defaultMapping[errorName.name]
  } else if (typeof errorName === 'function') { // classes are functions
    if (status === undefined) {
      return customMapping[errorName.typeName] || defaultMapping[errorName.typeName]
    } // else, we update the customMapping
    customMapping[errorName.name] = status
  } else if (typeof errorName === 'object') {
    Object.assign(customMapping, errorName) // bulk update customMappings
  } else if (status === undefined) { // return customMapping value
    return customMapping[errorName] || defaultMapping[errorName]
  } else { // both errorName and status are defined, set individual customMapping
    customMapping[errorName] = status
  }
}

export { mapErrorsToHttpStatus }
