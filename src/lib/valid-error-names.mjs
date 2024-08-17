import * as exports from '../index'

const nonErrorExports = [
  'commonErrorSettings',
  'maskNoAccessErrors',
  'mapErrorToHttpStatus',
  'mapHttpStatusToName',
  'registerParent',
  'wrapError'
]

const exportedErrors = Object.keys(exports).filter((name) => !nonErrorExports.includes(name))

const validErrorNames = exportedErrors.reduce((acc, errorName) => { acc[errorName] = true; return acc }, {})

export { validErrorNames }
