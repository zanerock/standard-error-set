import { ArgumentInvalidError } from '../argument-invalid-error'
import { mapHttpStatusToName } from '../map-http-status-to-name'

describe('mapHttpStatusToName', () => {
  beforeEach(() => mapHttpStatusToName())
  afterAll(() => mapHttpStatusToName())

  test.each([
    [400, 'Bad Request'],
    [401, 'Unauthorized'],
  ])('%p => %s', (status, name) =>
    expect(mapHttpStatusToName(status)).toBe(name)
  )

  test('can set individual mappings', () => {
    mapHttpStatusToName(401, 'Not Permitted')
    expect(mapHttpStatusToName(401)).toBe('Not Permitted')
  })

  test('can bulk assign mappings', () => {
    mapHttpStatusToName({ 400: 'Invalid Request', 401: 'Not Permitted' })
    expect(mapHttpStatusToName(400)).toBe('Invalid Request')
    expect(mapHttpStatusToName(401)).toBe('Not Permitted')
  })

  test('updated mappings are effective in setting status name', () => {
    const error1 = new ArgumentInvalidError()
    expect(error1.statusName).toBe('Bad Request')
    mapHttpStatusToName(400, 'Invalid Request')
    const error2 = new ArgumentInvalidError()
    expect(error2.statusName).toBe('Invalid Request')
  })
})
