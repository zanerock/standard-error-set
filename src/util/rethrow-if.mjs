import { ExternalServiceError } from '../errors/service/external-service-error'

/**
 * One liner to test and re-throw errors if any conditions are met.
 * @param {Error|undefined} [error = undefined] - The `Error` to test against and possibly re-throw.
 * @param {object} [testOptions = {}] - The set of conditions to test against. If any of the conditions test true, then
 *   the error` is re-thrown.
 * @param {string|Array.<string>|undefined} [testOptions.codeIs = undefined] - Throws if `error.code` is _any_ of the
 *   listed codes.
 * @param {string|Array.<string>|undefined} [testOptions.codeIsNot = undefined] - Throws if `error.code` is _not any_ of
 *   the listed codes.
 * @param {Function | Array.<Function> | undefined} [testOptions.instanceOf = undefined] - Throws if `error` is an
 *   instance of _any_ of the listed classes.
 * @param {Function | Array.<Function> | undefined} [testOptions.instanceOfNot = undefined] - Throws if `error` is not
 *   an instance of _any_ of the listed classes.
 * @param {boolean|undefined} [testOptions.isLocal = undefined] - If set, then tests whether the error is marked as
 *   'isLocal' or not. Errors that do not expose this field directly are always considered local, except for instances
 *   of {@link ExternalServiceError}, which are always considered remote.
 * @param {number|undefined} [testOptions.statusGt = undefined] - Throws if `error.status` is defined and status is
 *   _greater than_ the specified status.
 * @param {number|undefined} [testOptions.statusGte = undefined] - Throws if `error.status` is defined and status is
 *   _greater than or equal_ to the  specified status.
 * @param {number|undefined} [testOptions.statusLt = undefined] - Throws if `error.status` is defined and status is
 *   _less than_ the specified status.
 * @param {number|undefined} [testOptions.statusLte = undefined] - Throws if `error.status` is defined and status is
 *   _less than or equal_ to the  specified status.
 * @param {number|Array.<number>|undefined} [testOptions.statusIs = undefined] - Throws if `error.status` is defined and
 *   _any_ of the specified statuses.
 * @param {number|Array.<number>|undefined} [testOptions.statusIsNot = undefined] - Throws if `error.status` is defined
 *   and _not any_ of the specified statuses.
 * @returns {Error|undefined} - If the function does not throw, it returns the `error`.
 */
const rethrowIf = (error, testOptions) => {
  if (error === undefined) return

  if (rethrowTest(error, testOptions) === true) {
    // codeIs = codeIsNot || instanceOfNot || statusLt || statusIsNot
    throw error
  }

  return error
}

const rethrowTest = (
  error,
  {
    and,
    codeIs,
    codeIsNot,
    instanceOf,
    instanceOfNot,
    isLocal,
    statusGt,
    statusGte,
    statusIs,
    statusIsNot,
    statusLt,
    statusLte,
  } = {}
) => {
  const { code, isLocal: isErrorLocal, status } = error
  const orTest =
    arrarify(codeIs).includes(code)
    || (codeIsNot !== undefined && !arrarify(codeIsNot).includes(code))
    || arrarify(instanceOf).some((TestClass) => error instanceof TestClass)
    || (instanceOfNot !== undefined
      && arrarify(instanceOfNot).some(
        (TestClass) => !(error instanceof TestClass)
      ))
    || (isLocal !== undefined
      && ((isLocal === true
        && (isErrorLocal === true || isErrorLocal === undefined)
        && !(error instanceof ExternalServiceError))
        || (isLocal === false
          && (isErrorLocal === false
            || error instanceof ExternalServiceError))))
    || (error.status !== undefined
      && ((statusGt !== undefined && status > statusGt)
        || (statusGte !== undefined && status >= statusGte)
        || (statusLt !== undefined && status < statusLt)
        || (statusLte !== undefined && status <= statusLte)
        || arrarify(statusIs).includes(status)
        || (statusIsNot !== undefined && !arrarify(statusIsNot).includes(status))))

  const andTest = and === undefined ? true : rethrowTest(error, and)

  return orTest && andTest
}

const arrarify = (input) => {
  if (input === undefined) return []
  else if (Array.isArray(input)) return input
  else return [input]
}

export { rethrowIf }
