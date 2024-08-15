const generateBadArgumentMessage = (issue, valueIntro, { packageName, functionName, argumentName, argumentValue }) => {
  let message = 'Function '
  if (packageName !== undefined) {
    message += functionName === undefined ? `in package '${packageName}' ` : `'${packageName}#`
  }
  if (functionName !== undefined) {
    message += `${packageName === undefined ? "'" : ''}${functionName}()' `
  }
  message += 'argument '
  if (argumentName !== undefined) {
    message += `'${argumentName}' `
  }
  message += issue
  if (argumentValue !== undefined) {
    try {
      const valueString = typeof argumentValue === 'object' ? JSON.stringify(argumentValue) : argumentValue
      if (valueIntro) { // allow '', undefined, etc.
        message += ' ' + valueIntro
      }
      message += ` '${valueString}'`
    } catch (e) {}
  }
  message += '.'

  return message
}

export { generateBadArgumentMessage }