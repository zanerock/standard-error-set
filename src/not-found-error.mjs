import { CommonError } from './common-error'

const name = 'NotFoundError'

/**
 * An error indicating a resource or entity cannot be found. This error is used with local and remote resources/entities
 * where the fundamental issue is the named thing not being present.
 */
const NotFoundError = class extends CommonError {
  constructor({ message, status, ...options }) {
    super(name, message, { code: 'ENOENT', status, ...options })
  }
}

NotFoundError.typeName = name

export { NotFoundError }