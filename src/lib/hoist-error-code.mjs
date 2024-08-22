const hoistErrorCode = (options) => {
  const { cause, code, noHoistCode } = options
  if (code === undefined && noHoistCode !== true) {
    options.code = cause?.code
  }
}

export { hoistErrorCode }
