import { AuthError } from './auth-error'

const name = 'NotPermittedError'

/**
 * An {@link AuthError} indicating the user lacks authorization to perform some operation. Consider whether any of the 
 * following errors might be more precise or better suited:
 * - {@link AuthenticationError}
 * - {@link BadCredentialsError}
 * - {@link AuthorizationConditionsNotMetError}
 * - {@link NoAccessError}
 */
const NotPermittedError = class extends AuthError {
  constructor({ message, status, ...options }) {
    super(name, message, { status, ...options })
  }
}

NotPermittedError.typeName = name

export { NotPermittedError }