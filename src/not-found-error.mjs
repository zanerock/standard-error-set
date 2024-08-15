import { CommonError } from './common-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'NotFoundError'

/**
 * An error indicating a resource or entity cannot be found. This error is used with local and remote resources/entities
 * where the fundamental issue is the named thing not being present.
 */
const NotFoundError = class extends CommonError {
  constructor ({ name = myName, code = 'ENOENT', ...options }) {
    super({ name, code, ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(NotFoundError).name)

NotFoundError.typeName = myName

export { NotFoundError }
