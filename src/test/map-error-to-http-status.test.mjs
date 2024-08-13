import { InvalidArgumentError } from '../invalid-argument-error'
import { mapErrorToHttpStatus } from '../map-error-to-http-status'
import { validErrorNames } from '../lib/valid-error-names'

describe('mapErrorToHttpStatus', () => {
  beforeEach(() => mapErrorToHttpStatus())
  afterAll(() => mapErrorToHttpStatus())

  test.each(Object.keys(validErrorNames))('retrieves status for %s (string)',
    (errorName) => expect(typeof mapErrorToHttpStatus(errorName)).toBe('number'))

  test('retrieves status for class', () => expect(mapErrorToHttpStatus(InvalidArgumentError)).toBe(400))

  test('retrieves status for class instance', () => {
    const error = new InvalidArgumentError()
    expect(mapErrorToHttpStatus(error)).toBe(400)
  })

  test('can set individual mappings (with string name)', () => {
    mapErrorToHttpStatus('InvalidArgumentError', 401)
    expect(mapErrorToHttpStatus('InvalidArgumentError', 401))
  })

  test('can set individual mappings (with class)', () => {
    mapErrorToHttpStatus(InvalidArgumentError, 401)
    expect(mapErrorToHttpStatus('InvalidArgumentError', 401))
  })

  test('can bulk assign mappings', () => {
    mapErrorToHttpStatus({ InvalidArgumentError : 401, CustomError : 401 })
    expect(mapErrorToHttpStatus('InvalidArgumentError')).toBe(401)
    expect(mapErrorToHttpStatus('CustomError')).toBe(401)
  })

  test('updated mappings are effective in setting error instance status', () => {
    const error1 = new InvalidArgumentError()
    expect(error1.status).toBe(400)
    mapErrorToHttpStatus(InvalidArgumentError, 401)
    expect(mapErrorToHttpStatus('InvalidArgumentError')).toBe(401)
    const error2 = new InvalidArgumentError()
    expect(error2.status).toBe(401)
  })
})
