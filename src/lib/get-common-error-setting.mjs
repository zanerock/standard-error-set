const defaultSettings = {
  ignoreForMessage       : undefined,
  noInstanceHidingOnWrap : false,
  wrapUserErrorType      : undefined,
}

const customSettings = {}

const getCommonErrorSetting = (option) => {
  return customSettings[option] || defaultSettings[option]
}

export { customSettings, defaultSettings, getCommonErrorSetting }
