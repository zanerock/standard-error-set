import { ArgumentInvalidError } from '../argument-invalid-error'
import { mapErrorToHttpStatus } from '../map-error-to-http-status'
import { validErrorNames } from '../lib/valid-error-names'

describe('mapErrorToHttpStatus', () => {
  beforeEach(() => mapErrorToHttpStatus())
  afterAll(() => mapErrorToHttpStatus())

  test.each(Object.keys(validErrorNames))(
    'retrieves status for %s (string)',
    (errorName) => expect(typeof mapErrorToHttpStatus(errorName)).toBe('number')
  )

  test('retrieves status for class', () =>
    expect(mapErrorToHttpStatus(ArgumentInvalidError)).toBe(400))

  test('retrieves status for class instance', () => {
    const error = new ArgumentInvalidError()
    expect(mapErrorToHttpStatus(error)).toBe(400)
  })

  test('can set individual mappings (with string name)', () => {
    mapErrorToHttpStatus('ArgumentInvalidError', 401)
    expect(mapErrorToHttpStatus('ArgumentInvalidError', 401))
  })

  test('can set individual mappings (with class)', () => {
    mapErrorToHttpStatus(ArgumentInvalidError, 401)
    expect(mapErrorToHttpStatus('ArgumentInvalidError', 401))
  })

  test('can bulk assign mappings', () => {
    mapErrorToHttpStatus({ ArgumentInvalidError: 401, CustomError: 401 })
    expect(mapErrorToHttpStatus('ArgumentInvalidError')).toBe(401)
    expect(mapErrorToHttpStatus('CustomError')).toBe(401)
  })

  test('updated mappings are effective in setting error instance status', () => {
    const error1 = new ArgumentInvalidError()
    expect(error1.status).toBe(400)
    mapErrorToHttpStatus(ArgumentInvalidError, 401)
    expect(mapErrorToHttpStatus('ArgumentInvalidError')).toBe(401)
    const error2 = new ArgumentInvalidError()
    expect(error2.status).toBe(401)
  })
})
