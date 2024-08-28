import { getCommonErrorSetting } from './get-common-error-setting'

/**
 * Determines whether, based on parameter value and settings, whether the parameter should be used in creating a
 * constructed message. If the parameter value is undefined or an empty array, then it is not included. Otherwise,
 * `options.ignoreForMessage` or, if that is not defined, the common settings 'ignoreForMessage' setting is checked to
 * see if the `parameterName` is included.
 * @param {string} parameterName - The name of the parameter to check.
 * @param {object} options - The (relevant) constructor options.
 * @returns {boolean} - A boolean indicating whether to include the parameter in the message construction or not.
 * @private
 */
const includeParameterInMessage = (parameterName, options) => {
  const parameterValue = options[parameterName]
  if (
    parameterValue === undefined
    || (Array.isArray(parameterValue) && parameterValue.length === 0)
  ) {
    return false // the parameter isn't defined, so we can ignore it based on that
  }

  return ignoreParameter(parameterName, options)
}

const ignoreParameter = (
  parameterName,
  { ignoreForMessage = getCommonErrorSetting('ignoreForMessage') || [] }
) =>
  !ignoreForMessage.includes(parameterName) && !ignoreForMessage.includes('all')

export { ignoreParameter, includeParameterInMessage }
