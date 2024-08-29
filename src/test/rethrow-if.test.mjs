import { ArgumentInvalidError } from '../argument-invalid-error'
import { ArgumentTypeError } from '../argument-type-error'
import { rethrowIf } from '../rethrow-if'

describe('rethrowIf', () => {
  const THROW = true
  const NO_THROW = false
  const noEntError = new Error()
  const noEntCode = 'ENOENT'
  noEntError.code = noEntCode
  const status500Error = new Error()
  status500Error.status = 500

  test.each([
    [undefined, undefined, NO_THROW],
    [new Error(), undefined, NO_THROW],
    [noEntError, { codeIs : noEntCode }, THROW],
    [noEntError, { codeIs : [noEntCode] }, THROW],
    [noEntError, { codeIsNot : noEntCode }, NO_THROW],
    [noEntError, { codeIsNot : [noEntCode] }, NO_THROW],
    [
      new ArgumentInvalidError(),
      { isNotInstanceOf : ArgumentInvalidError },
      NO_THROW,
    ],
    [
      new ArgumentInvalidError(),
      { isNotInstanceOf : [ArgumentInvalidError] },
      NO_THROW,
    ],
    [new Error(), { instanceOfNot : ArgumentInvalidError }, THROW],
    [new Error(), { instanceOfNot : [ArgumentInvalidError] }, THROW],
    [new ArgumentInvalidError(), { instanceOf : ArgumentInvalidError }, THROW],
    [new ArgumentInvalidError(), { instanceOf : [ArgumentInvalidError] }, THROW],
    [new ArgumentTypeError(), { instanceOf : ArgumentInvalidError }, THROW],
    [new Error(), { instanceOf : ArgumentInvalidError }, NO_THROW],
    [status500Error, { statusGt : 500 }, NO_THROW],
    [status500Error, { statusGt : 400 }, THROW],
    [status500Error, { statusGte : 500 }, THROW],
    [status500Error, { statusGte : 501 }, NO_THROW],
    [status500Error, { statusLt : 500 }, NO_THROW],
    [status500Error, { statusLt : 501 }, THROW],
    [status500Error, { statusLte : 500 }, THROW],
    [status500Error, { statusLte : 499 }, NO_THROW],
    [status500Error, { statusIs : 499 }, NO_THROW],
    [status500Error, { statusIs : [499] }, NO_THROW],
    [status500Error, { statusIs : 500 }, THROW],
    [status500Error, { statusIsNot : 499 }, THROW],
    [status500Error, { statusIsNot : [499] }, THROW],
    [status500Error, { statusIsNot : 500 }, NO_THROW],
    [
      new ArgumentInvalidError(),
      { instanceOf : ArgumentInvalidError, and : { statusIs : 500 } },
      NO_THROW,
    ],
  ])(
    'error %p, re-throw options %p => will throw: %p',
    (error, options, expectThrow) => {
      if (expectThrow === THROW) {
        expect(() => rethrowIf(error, options)).toThrow()
      }
      else expect(() => rethrowIf(error, options)).not.toThrow()
    }
  )
})
