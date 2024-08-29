/* globals wrapError */
import { ArgumentInvalidError } from './argument-invalid-error'
import { ArgumentTypeError } from './argument-type-error'
import { CommonError } from './common-error'
import {
  customSettings,
  defaultSettings,
  getCommonErrorSetting
} from './lib/get-common-error-setting'

/**
 * Used to retrieve and manage options used in {@link wrapError} and [message construction](#message-construction).
 *
 * - To retrieve a setting, call `commonErrorSettings(option)` (where `option` is a `string`).
 * - To add/override a single setting, call `commonErrorSettings(option, value)`.
 * - To bulk add/override settings, call `commonErrorSettings(mappings)` (where `mappings is an `Object`).
 * - To reset the custom settings to default, call `commonErrorSettings()`.
 *
 * Currently, we support three settings. Two influence the behavior of {@link wrapError} (refer to `wrapError`
 * documentation for further details):
 * - `noInstanceHidingOnWrap` - Controls whether or not errors that are not class `Error` are wrapped or not.
 * - `wrapUserErrorType` - Controls the resulting class when wrapping errors associated with bad user input.
 *
 * The third option `ignoreForMessage` (an array of string) specifies parameters to ignore when [constructing an error
 * message](#message-construction). This can be used to hide details from end users.
 * @param {string|object} option - Then name of the setting, or bulk settings `Object`.
 * @param {*} value - The value of the setting. The necessary type depends on the `option`.
 * @returns {*} The value of the indicated `option`. The type will depend on the particular `option`.
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
    return getCommonErrorSetting(option)
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
      issue         : 'is not a valid common error setting.',
      hint          : `Specify one of '${Object.keys(defaultSettings).join("', '")}'.`,
      status        : 500,
    })
  }

  if (option === 'ignoreForMessage') {
    if (
      value !== undefined
      && (!Array.isArray(value) || value.some((v) => typeof v !== 'string'))
    ) {
      throw new ArgumentTypeError({
        argumentName  : 'value',
        argumentValue : value,
        argumentType  : 'string[]',
        status        : 500,
      })
    }
  }
  else if (typeof defaultSettings[option] === 'boolean') {
    if (!(value === true || value === false)) {
      throw new ArgumentTypeError({
        argumentName  : 'value',
        argumentValue : value,
        argumentType  : 'boolean',
        status        : 500,
      })
    }
  }
  else if (value !== undefined) {
    const ErrorClass = value
    const testError = new ErrorClass()
    if (!(testError instanceof CommonError)) {
      throw new ArgumentTypeError({
        argumentName  : 'value',
        argumentValue : value,
        argumentType  : "CommonError' class or sub-class or 'undefined",
        status        : 500,
      })
    }
  }
}

export { commonErrorSettings }
