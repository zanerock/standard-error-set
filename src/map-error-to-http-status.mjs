const defaultMapping = {
  InvalidArgumentError : 400
}

const customMapping = {}

// There's a bug where the linting really wants shorthand, but the parser can't deal with it. Also, CommonError is
// defined, we just don't see it when parsing this file on it's own.
/* eslint-disable jsdoc/check-types, jsdoc/no-undefined-types */
/**
 * Used to translate and manage translation of error names to HTTP status codes. You can use this function to add your 
 * own mappings, which may be useful when dealing with non-common error errors.
 * - To retrieve a status, call `mapErrorToHttpStatus(errorRef)`.
 * - To add/override a status mapping, call `mapErrorToHttpStatus(errorRef, status)`.
 * - To bulk add/override status mappings, call `mapErrorToHttpStatus(mappingObject)` where `mappingObject` is an
 *   `Object<string,true>`.
 * - To reset the custom mappings to the default mappings, call `mapErrorToHttpStatus()` with no arguments.
 * @param {string|Error|CommonError.constructor|Object<string,true>} errorRef - The name, instance, or class 
 *   (`instanceof ${linkplain CommonError)`) of the error to either retrieve or set status for, or `Object<
 *   string,true>` `for bulk add/override of the custom mappings.
 * @param {number} status - An integer value to map the error to.
 * @returns {number|undefined} - Returns an integer if retrieving an error to status mapping, otherwise return
 *   undefined.
 */
const mapErrorToHttpStatus = (errorRef, status) => { /* eslint-enable jsdoc/check-types */
  if (errorRef === undefined) { // reset customMapping to default
    for (const prop in customMapping) {
      delete customMapping[prop]
    }
    return
  }

  let name = errorRef // we just leave it if it's a string
  if (errorRef instanceof Error) {
    name = errorRef.name
  } else if (typeof errorRef === 'function') { // classes are functions
    name = errorRef.typeName
  } else if (typeof errorRef === 'object') { // do this here, because if it's an instanceof Error, we skip this
    Object.assign(customMapping, errorRef) // bulk update customMappings
    return
  }

  // it's either a regular retrieve or single value add/override
  if (status === undefined) { // return customMapping value
    return customMapping[name] || defaultMapping[name]
  } else { // both errorRef and status are defined, set individual customMapping
    customMapping[name] = status
  }
}

export { mapErrorToHttpStatus }
