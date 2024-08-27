/**
 * One liner to test and re-throw errors if any conditions are met.
 * @param {Error|undefined} [error = undefined] - The `Error` to test against and possibly re-throw.
 * @param {object} [options = {}] - The set of conditions to test against. If any of the conditions test true, then the
 *   `error` is re-thrown.
 * @param {string|Array.<string>|undefined} [options.codeIs = undefined] - Throws if `error.code` is _any_ of the
 *   listed codes.
 * @param {string|Array.<string>|undefined} [options.codeIsNot = undefined] - Throws if `error.code` is _not any_ of
 *   the listed codes.
 * @param {Function | Array.<Function> | undefined} [options.instanceOf = undefined] - Throws if `error` is an instance
 *   of _any_ of the listed classes.
 * @param {Function | Array.<Function> | undefined} [options.instanceOfNot = undefined] - Throws if `error` is not an
 *   instance of _any_ of the listed classes.
 * @param {number|undefined} [options.statusGt = undefined] - Throws if `error.status` is defined and status is
 *   _greater than_ the specified status.
 * @param {number|undefined} [options.statusGte = undefined] - Throws if `error.status` is defined and status is
 *   _greater than or equal_ to the  specified status.
 * @param {number|undefined} [options.statusLt = undefined] - Throws if `error.status` is defined and status is _less
 *   than_ the specified status.
 * @param {number|undefined} [options.statusLte = undefined] - Throws if `error.status` is defined and status is _less
 *   than or equal_ to the  specified status.
 * @param {number|Array.<number>|undefined} [options.statusIs = undefined] - Throws if `error.status` is defined and
 *   _any_ of the specified statuses.
 * @param {number|Array.<number>|undefined} [options.statusIsNot = undefined] - Throws if `error.status` is defined and
 *   _not any_ of the specified statuses.
 * @returns {Error|undefined} - If the function does not throw, it returns the `error`.
 */
const rethrowIf = (error, {
  codeIs,
  codeIsNot,
  instanceOf,
  instanceOfNot,
  statusGt,
  statusGte,
  statusIs,
  statusIsNot,
  statusLt,
  statusLte,
} = {}) => {
  if (error === undefined) return

  const { code, status } = error

  if (arrarify(codeIs).includes(code)
    || (codeIsNot !== undefined && !arrarify(codeIsNot).includes(code))
    || arrarify(instanceOf).some((TestClass) => error instanceof TestClass)
    || (instanceOfNot !== undefined && arrarify(instanceOfNot).some((TestClass) => !(error instanceof TestClass)))
    || (error.status !== undefined && (
      (statusGt !== undefined && status > statusGt)
      || (statusGte !== undefined && status >= statusGte)
      || (statusLt !== undefined && status < statusLt)
      || (statusLte !== undefined && status <= statusLte)
      || arrarify(statusIs).includes(status)
      || (statusIsNot !== undefined && !arrarify(statusIsNot).includes(status))
    ))
  ) {
    throw (error)
  }

  return error
}

const arrarify = (input) => {
  if (input === undefined) return []
  else if (Array.isArray(input)) return input
  else return [input]
}

export { rethrowIf }
