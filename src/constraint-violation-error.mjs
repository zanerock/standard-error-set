/* globals ArgumentInvalidError */
import { CommonError } from './common-error'
import { generateConstraintMessage } from './lib/generate-constraint-message'
import { registerParent } from './map-error-to-http-status'

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
 * at the function level, while constraint violations result from database constraints.
 */
const ConstraintViolationError = class extends CommonError {
  /**
   * {@link ConstraintViolationError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.constraintType = 'constraint'] - The constraint type.
   * @param {string|undefined} [options.entityType = undefined] - The "type" of entity. E.g., 'user'.
   * @param {string[]|Array.<Array.string>} [options.fieldAndValues = []] - An array of either field names and/or
   *   arrays of field name + field value. You may mix and match, e.g., `['field1', ['field2', 'value2']`.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @param {object} defaults - @hidden Map of parameter names to default values. Used when `ignoreForMessage`
   *   indicates a parameter should be treated as not set.
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
