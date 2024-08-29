import * as exports from '../index'

const nonErrorExports = [
  'commonErrorSettings',
  'ignoreParameter',
  'includeParameterInMessage',
  'maskNoAccessErrors',
  'mapErrorToHttpStatus',
  'mapHttpStatusToName',
  'registerParent',
  'rethrowIf',
  'wrapError',
]

const exportedErrors = Object.keys(exports).filter(
  (name) => !nonErrorExports.includes(name)
)

const validErrorNames = exportedErrors.reduce((acc, errorName) => {
  acc[errorName] = true

  return acc
}, {})

export { validErrorNames }
