/* globals ArgumentInvalidError */
import { CommonError } from './common-error'
import { generateConstraintMessage } from './lib/generate-constraint-message'
import { registerParent } from './map-error-to-http-status'

const myName = 'ConstraintViolationError'

/**
 * Indicates the requested operation is well formed and the data otherwise correct, but it violates a data constraint.
 * `ConstraintViolationError` is distinguished from {@link ArgumentInvalidError} in that argument errors are evaluated
 * at the function level, while constraint violations result from database constraints.
 */
const ConstraintViolationError = class extends CommonError {
  /**
   * {@link ConstraintViolationError} constructor.
   * @param {object|undefined} options - The error options.
   * @param {string|undefined} options.constraintType - The constraint type.
   * @param {string|undefined} options.entityType - The "type" of entity. E.g., 'user'.
   * @param {string[]|Array.<Array.string>} options.fieldAndValues - An array of either field names and/or arrays of
   *   field name + field value. You may mix and match, e.g., `['field1', ['field2', 'value2']`.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object|undefined} options.options - @hidden The remainder of the options to to pass to `Error`.
   * @example
   * new ConstraintViolationError() // "Constraint violated."
   * new ConstraintViolationError({ constraintType: 'foreign key' }) // "Foreign key constraint violated."
   * new ConstraintViolationError({ entityType : 'user' }) // "Constraint on entity type 'user' violated."
   * // v "Enumeration constraint on fields <email> on entity type 'user' violated."
   * new ConstraintViolationError({ constraintType : 'enumeration', entityType : 'user', fieldAndValues : ['email'] })
   * // v "Constraint on fields <email(john@foo.com)> on entity type 'user' violated."
   * new ConstraintViolationError({ entityType : 'user', fieldAndValues : [['email', 'john@foo.com']] })
   */
  constructor({ name = myName, ...options } = {}) {
    options.message = options.message || generateConstraintMessage(options)
    super({ name, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ConstraintViolationError).name)

ConstraintViolationError.typeName = myName

export { ConstraintViolationError }
