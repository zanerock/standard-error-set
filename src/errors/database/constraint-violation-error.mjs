/* globals ArgumentInvalidError CommonError */
import { DatabaseError } from './database-error'
import { generateConstraintMessage } from './lib/generate-constraint-message'
import { registerParent } from '../../settings/map-error-to-http-status'

const myName = 'ConstraintViolationError'
const defaultConstraintType = 'constraint'
const defaultFieldAndValues = []
const myDefaults = {
  constraintType : defaultConstraintType,
  fieldAndValues : defaultFieldAndValues,
}

/**
 * Indicates the requested operation is well formed and the data otherwise correct, but it violates a data constraint.
 * `ConstraintViolationError` is distinguished from {@link ArgumentInvalidError} in that argument errors are evaluated
 * at the function level, while constraint violations result from database constraints. Refer to {@link DatabaseError}
 * for [remote vs local database errors](#database-error-remote-vs-local-database-errors).
 * @category Database errors
 */
const ConstraintViolationError = class extends DatabaseError {
  /**
   * {@link ConstraintViolationError} constructor.
   *
   * See the [common constructor options](#common-constructor-options) note for additional parameters.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.constraintType = 'constraint'] - The constraint type.
   * @param {string|undefined} [options.entityType = undefined] - The "type" of entity. E.g., 'user'.
   * @param {string[]|Array.<Array.string>} [options.fieldAndValues = []] - An array of either field names and/or
   *   arrays of field name + field value. You may mix and match, e.g., `['field1', ['field2', 'value2']`.
   * @param {boolean} [options.isLocal = false] - Indicates whether the error arises from a remote database or not.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   {{> common-hidden-parameters }}
   * @example
   * new ConstraintViolationError() // "Constraint violated."
   * new ConstraintViolationError({ constraintType: 'foreign key' }) // "Foreign key constraint violated."
   * new ConstraintViolationError({ entityType : 'user' }) // "Constraint on entity type 'user' violated."
   * // v "Enumeration constraint on fields <email> on entity type 'user' violated."
   * new ConstraintViolationError({ constraintType : 'enumeration', entityType : 'user', fieldAndValues : ['email'] })
   * // v "Constraint on fields <email(john@foo.com)> on entity type 'user' violated."
   * new ConstraintViolationError({ entityType : 'user', fieldAndValues : [['email', 'john@foo.com']] })
   */
  constructor(
    {
      name = myName,
      constraintType = defaultConstraintType,
      fieldAndValues = defaultFieldAndValues,
      ...options
    } = {},
    defaults
  ) {
    defaults = Object.assign({}, myDefaults, defaults)
    options.message =
      options.message
      || generateConstraintMessage(
        { constraintType, fieldAndValues, ...options },
        defaults
      )
    super({ name, constraintType, fieldAndValues, ...options }, defaults)
  }
}

registerParent(myName, Object.getPrototypeOf(ConstraintViolationError).name)

ConstraintViolationError.typeName = myName

export { ConstraintViolationError }
