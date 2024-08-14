import { ConnectionError } from './connection-error'

const name = 'ConnectionResetError'

/**
 * A {@link ConnectionError} sub-type indicating a connection has been reset or closed unexpectedly or while in use.
 */
const ConnectionResetError = class extends ConnectionError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, code: 'ECONNRESET', ...options })
  }
}

ConnectionResetError.typeName = name

export { ConnectionResetError }