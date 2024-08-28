import { CommonError } from '../common-error'

describe('CommonError', () => {
  describe('code hoisting', () => {
    const cause = new Error()
    const code = 'EBLAH'
    cause.code = code

    test('hoists cause code by default', () => {
      const commonError = new CommonError({ cause })
      expect(commonError.code).toBe(code)
    })

    test("respects 'noHoistCode' option", () => {
      const commonError = new CommonError({ cause, noHoistCode: true })
      expect(commonError.code).toBe(undefined)
    })

    test("respects explicit 'code' override", () => {
      const myCode = 'EFOO'
      const commonError = new CommonError({ cause, code: myCode })
      expect(commonError.code).toBe(myCode)
    })
  })
})
