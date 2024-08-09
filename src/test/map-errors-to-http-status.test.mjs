import { InvalidArgumentError } from '../invalid-argument-error'
import { mapErrorsToHTTPStatus } from '../map-errors-to-http-status'
import { validErrorNames } from '../lib/valid-error-names'

describe('mapErrorsToHTTPStatus', () => {
  beforeEach(() => mapErrorsToHTTPStatus())
  afterAll(() => mapErrorsToHTTPStatus())

  test.each(Object.keys(validErrorNames))('retrieves status for %s (string)', 
    (errorName) => expect(typeof mapErrorsToHTTPStatus(errorName)).toBe('number'))

  test('retrieves status for class', () => expect(mapErrorsToHTTPStatus(InvalidArgumentError)).toBe(400))

  test('retrieves status for class instance', () => {
    const error = new InvalidArgumentError()
    expect(mapErrorsToHTTPStatus(error)).toBe(400)
  })

  test('can set individual mappings (with string name)', () => {
    mapErrorsToHTTPStatus('InvalidArgumentError', 401)
    expect(mapErrorsToHTTPStatus('InvalidArgumentError', 401))
  })

  test('can set individual mappings (with class)', () => {
    mapErrorsToHTTPStatus(InvalidArgumentError, 401)
    expect(mapErrorsToHTTPStatus('InvalidArgumentError', 401))
  })

  test('can bulk assign mappings', () => {
    mapErrorsToHTTPStatus({ InvalidArgumentError: 401, CustomError: 401 })
    expect(mapErrorsToHTTPStatus('InvalidArgumentError')).toBe(401)
    expect(mapErrorsToHTTPStatus('CustomError')).toBe(401)
  })

  test('updated mappings are effective in setting error instance status', () => {
    const error1 = new InvalidArgumentError()
    expect(error1.status).toBe(400)
    mapErrorsToHTTPStatus(InvalidArgumentError, 401)
    expect(mapErrorsToHTTPStatus('InvalidArgumentError')).toBe(401)
    const error2 = new InvalidArgumentError()
    expect(error2.status).toBe(401)
  })
})