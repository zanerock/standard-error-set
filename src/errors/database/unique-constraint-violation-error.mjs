/* globals CommonError DatabaseError */
import { ConstraintViolationError } from './constraint-violation-error'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'UniqueConstraintViolationError'
const defaultConstraintType = 'unique'
const myDefaults = { constraintType : defaultConstraintType }

/**
 * A {@link ConstraintViolationError} sub-type indicating violation of a unique constraint, such as login ID. Refer to
 * {@link DatabaseError} for [remote vs local database errors](#database-error-remote-vs-local-database-errors).
 * @category Database errors
 */
const UniqueConstraintViolationError = class extends ConstraintViolationError {
  /**
   * {@link UniqueConstraintViolationError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.constraintType = 'unique constraint'] - The constraint type.
   * @param {string|undefined} [options.entityType = undefined] - The "type" of entity (e.g., 'user'; optional).
   * @param {string[]|Array.<Array.string>} [options.fieldAndValues = []] - An array of either field names and/or
   *   arrays of field name + field value (optional). You may mix and match, e.g., `['field1', ['field2', 'value2']`.
   * @param {boolean} [options.isLocal = false] - Indicates whether the error arises from a remote database or not.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
   * @example
   * new UniqueConstraintViolationError() // "Unique constraint violated."
   * new UniqueConstraintViolationError({ entityType : 'user' }) // "Unique constraint on entity type 'user' violated."
   * // v "Unique constraint on fields <email>."
   * new UniqueConstraintViolationError({ entityType : 'user', fieldAndValues : ['email'] })
   * // v "Unique constraint on fields <email(john@foo.com)> on entity type 'user' violated."
   * new UniqueConstraintViolationError({ entityType : 'user', fieldAndValues : [['email', 'john@foo.com']] })
   */
  constructor(
    { name = myName, constraintType = defaultConstraintType, ...options } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    super({ name, constraintType, ...options }, defaults)
  }
}

registerParent(
  myName,
  Object.getPrototypeOf(UniqueConstraintViolationError).name
)

UniqueConstraintViolationError.typeName = myName

export { UniqueConstraintViolationError }
