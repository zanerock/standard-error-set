import { InvalidArgumentError } from '../invalid-argument-error'
import { mapErrorsToHttpStatus } from '../map-errors-to-http-status'
import { validErrorNames } from '../lib/valid-error-names'

describe('mapErrorsToHttpStatus', () => {
  beforeEach(() => mapErrorsToHttpStatus())
  afterAll(() => mapErrorsToHttpStatus())

  test.each(Object.keys(validErrorNames))('retrieves status for %s (string)',
    (errorName) => expect(typeof mapErrorsToHttpStatus(errorName)).toBe('number'))

  test('retrieves status for class', () => expect(mapErrorsToHttpStatus(InvalidArgumentError)).toBe(400))

  test('retrieves status for class instance', () => {
    const error = new InvalidArgumentError()
    expect(mapErrorsToHttpStatus(error)).toBe(400)
  })

  test('can set individual mappings (with string name)', () => {
    mapErrorsToHttpStatus('InvalidArgumentError', 401)
    expect(mapErrorsToHttpStatus('InvalidArgumentError', 401))
  })

  test('can set individual mappings (with class)', () => {
    mapErrorsToHttpStatus(InvalidArgumentError, 401)
    expect(mapErrorsToHttpStatus('InvalidArgumentError', 401))
  })

  test('can bulk assign mappings', () => {
    mapErrorsToHttpStatus({ InvalidArgumentError : 401, CustomError : 401 })
    expect(mapErrorsToHttpStatus('InvalidArgumentError')).toBe(401)
    expect(mapErrorsToHttpStatus('CustomError')).toBe(401)
  })

  test('updated mappings are effective in setting error instance status', () => {
    const error1 = new InvalidArgumentError()
    expect(error1.status).toBe(400)
    mapErrorsToHttpStatus(InvalidArgumentError, 401)
    expect(mapErrorsToHttpStatus('InvalidArgumentError')).toBe(401)
    const error2 = new InvalidArgumentError()
    expect(error2.status).toBe(401)
  })
})
