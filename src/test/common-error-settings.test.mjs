import { CommonError } from '../common-error'
import { commonErrorSettings } from '../common-error-settings'

describe('commonErrorSettings', () => {
  beforeEach(() => commonErrorSettings())
  afterAll(() => commonErrorSettings())

  test.each([
    ['noInstanceHidingOnWrap', false],
    ['wrapUserErrorType', undefined],
  ])('%p => %s', (option, value) =>
    expect(commonErrorSettings(option)).toBe(value))

  test('can set individual settings', () => {
    commonErrorSettings('noInstanceHidingOnWrap', true)
    expect(commonErrorSettings('noInstanceHidingOnWrap')).toBe(true)
  })

  test('can bulk assign settings', () => {
    commonErrorSettings({
      noInstanceHidingOnWrap : true,
      wrapUserErrorType      : CommonError,
    })
    expect(commonErrorSettings('noInstanceHidingOnWrap')).toBe(true)
    expect(commonErrorSettings('wrapUserErrorType')).toBe(CommonError)
  })

  test('catches invalid options', () => {
    try {
      commonErrorSettings('foo', 'bar')
      throw new Error('Failed to catch invalid option.')
    }
    catch (e) {
      expect(e.message).toMatch(/is not a valid common error setting/)
    }
  })

  test("catches invalid 'noInstanceHidingOnWrap'", () => {
    try {
      commonErrorSettings('noInstanceHidingOnWrap', 'bar')
      throw new Error("Failed to catch invalid 'noInstanceHidingOnWrap' value.")
    }
    catch (e) {
      expect(e.message).toMatch(/type 'boolean'.*?is wrong type.$/)
    }
  })

  test("catches invalid 'wrapUserErrorType'", () => {
    try {
      commonErrorSettings('wrapUserErrorType', Error)
      throw new Error("Failed to catch invalid 'wrapUserErrorType' value.")
    }
    catch (e) {
      expect(e.message).toMatch(
        /type 'CommonError' class or sub-class or 'undefined'.*?is wrong type.$/
      )
    }
  })
})
