/* globals CommonError */
import { ConstraintViolationError } from './constraint-violation-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'UniqueConstraintViolationError'

/**
 * A {@link ConstraintViolationError} sub-type indicating violation of a unique constraint, such as login ID.
 */
const UniqueConstraintViolationError = class extends ConstraintViolationError {
  /**
   * {@link UniqueConstraintViolationError} constructor.
   * @param {object} [options = {}] - Constructor options.
   * @param {string} [options.constraintType = 'unique constraint'] - The constraint type.
   * @param {string|undefined} [options.entityType = undefined] - The "type" of entity (e.g., 'user'; optional).
   * @param {string[]|Array.<Array.string>} [options.fieldAndValues = []] - An array of either field names and/or
   *   arrays of field name + field value (optional). You may mix and match, e.g., `['field1', ['field2', 'value2']`.
   * @param {string} options.name - @hidden Used internally to set the name; falls through to {@link CommonError}
   *   constructor.`
   * @param {object} [options.options = {}] - @hidden The remainder of the options to to pass to super-constructor.
   * @example
   * new UniqueConstraintViolationError() // "Unique constraint violated."
   * new UniqueConstraintViolationError({ entityType : 'user' }) // "Unique constraint on entity type 'user' violated."
   * // v "Unique constraint on fields <email>."
   * new UniqueConstraintViolationError({ entityType : 'user', fieldAndValues : ['email'] })
   * // v "Unique constraint on fields <email(john@foo.com)> on entity type 'user' violated."
   * new UniqueConstraintViolationError({ entityType : 'user', fieldAndValues : [['email', 'john@foo.com']] })
   */
  constructor({ name = myName, constraintType = 'unique', ...options } = {}) {
    super({ name, constraintType, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(UniqueConstraintViolationError).name)

UniqueConstraintViolationError.typeName = myName

export { UniqueConstraintViolationError }
