const hoistErrorCode(options) => {
  const { cause, code } = options
  if (code === undefined) {
    options.code = cause.code
  }
}

export { hoistErrorCode }