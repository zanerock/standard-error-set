const generateBadArgumentMessage = (issue, { packageName, functionName, argumentName, argumentValue }) => {
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
  if (argumentValue !== undefined) {
    try {
      const valueString = argumentValue = typeof argumentValue === 'object' ? JSON.stringify(argumentValue) : argumentValue
      message += `with value '${valueString}' `
    } catch (e) {}
  }
  message += `${issue}.`

  return message
}

export { generateBadArgumentMessage }
