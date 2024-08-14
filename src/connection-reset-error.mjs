import { ConnectionError } from './connection-error'
import { registerParent } from './map-error-to-http-status'

const myName = 'ConnectionResetError'

/**
 * A {@link ConnectionError} sub-type indicating a connection has been reset or closed unexpectedly or while in use.
 */
const ConnectionResetError = class extends ConnectionError {
  constructor ({ name = myName, ...options }) {
    super(name, message, { status, code : 'ECONNRESET', ...options })
  }
}

registerParent(myName, Object.getPrototypeOf(ConnectionResetError).name)

ConnectionResetError.typeName = myName

export { ConnectionResetError }
