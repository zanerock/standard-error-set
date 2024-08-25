const translateValue = (value) => {
  const typeOfValue = typeof value
  if (typeOfValue === 'function') {
    return '<function>'
  }
  else if (typeOfValue === 'object') {
    if (value.hasOwnProperty('toString')) {
      return value.toString()
    }
    else {
      try {
        return JSON.stringify(value)
      }
      catch (e) {
        return value.toString()
      }
    }
  }
  else {
    return value
  }
}

export { translateValue }