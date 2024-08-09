const defaultMapping = {
  InvalidArgumentError : 400
}

const mapping = {}

const mapErrorsToHTTPStatus = (errorName, status) => {
  if (errorName === undefined) { // reset mapping to default
    for (const prop in mapping) {
      delete mapping[prop]
    }
  } else if (errorName instanceof Error) {
    return mapping[errorName.name] || defaultMapping[errorName.name]
  } else if (typeof errorName === 'function') { // classes are functions
    if (status === undefined) {
      return mapping[errorName.typeName] || defaultMapping[errorName.typeName]
    } // else, we update the mapping
    mapping[errorName.name] = status
  } else if (typeof errorName === 'object') {
    Object.assign(mapping, errorName) // bulk update mappings
  } else if (status === undefined) { // return mapping value
    return mapping[errorName] || defaultMapping[errorName]
  } else { // both errorName and status are defined, set individual mapping
    mapping[errorName] = status
  }
}

export { mapErrorsToHTTPStatus }
