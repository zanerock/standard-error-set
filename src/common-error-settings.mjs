/* globals wrapError */
import { ArgumentInvalidError } from './argument-invalid-error'
import { CommonError } from './common-error'

const defaultSettings = {
  noInstanceHidingOnWrap : false,
  wrapUserErrorType      : undefined,
}

const customSettings = {}

/**
 * Used to retrieve and manage options used in {@link wrapError}.
 * - To retrieve a setting, call `commonErrorSettings(option)` (where `option` is a `string`).
 * - To add/override a single setting, call `commonErrorSettings(option, value)`.
 * - To bulk add/override settings, call `commonErrorSettings(/mappings)` (where `mappings is an `Object`).
 * - To reset the custom settings to default, call `commonErrorSettings()`.
 *
 * Currently, we support two settings (see {@link wrapError} for details):
 * - `noInstanceHidingOnWrap` - Controls whether or not errors that are not class `Error` are wrapped or not.
 * - `wrapUserErrorType` - Controls the resulting class when wrapping errors associated with bad user input.
 * @param {string|object} option - Then name of the setting, or bulk settings `Object`.
 * @param {boolean | Function | undefined} value - The value of the setting.
 * @returns {boolean | Function | undefined} - The value of the indicated `option` or undefined.
 */
const commonErrorSettings = (option, value) => {
  if (option === undefined) {
    for (const prop in customSettings) {
      delete customSettings[prop]
    }
  }
  else if (typeof option === 'object') {
    for (const [newOpt, newVal] of Object.entries(option)) {
      verifyArguments(newOpt, newVal)
    }

    Object.assign(customSettings, option)
  }
  else if (value === undefined) {
    return customSettings[option] || defaultSettings[option]
  }
  else {
    verifyArguments(option, value)
    customSettings[option] = value
  }
}

const verifyArguments = (option, value) => {
  if (!(option in defaultSettings)) {
    throw new ArgumentInvalidError({
      argumentName  : 'option',
      argumentValue : option,
      issue         : `is not a valid common error setting; should be one of '${Object.keys(defaultSettings).join("', '")}'`,
    })
  }

  if (typeof defaultSettings[option] === 'boolean') {
    if (!(value === true || value === false)) {
      throw new ArgumentInvalidError({
        argumentName  : 'value',
        argumentValue : value,
        issue         : `must be literal 'true' or 'false' for option '${option}'`,
      })
    }
  }
  else if (!(value === undefined || (value instanceof CommonError))) {
    throw new ArgumentInvalidError({
      argumentName  : 'value',
      argumentValue : value,
      issue         : `must be literal 'undefined', or 'CommonError' class or sub-class for option '${option}'`,
    })
  }
}

export { commonErrorSettings }
