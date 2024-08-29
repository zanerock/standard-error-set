import { ArgumentInvalidError } from '../../errors/argument/argument-invalid-error'
import { ArgumentTypeError } from '../../errors/argument//argument-type-error'
import { ConstraintViolationError } from '../../errors/database/constraint-violation-error'
import { DatabaseError } from '../../errors/database/database-error'
import { ExternalServiceError } from '../../errors/service/external-service-error'
import { rethrowIf } from '../rethrow-if'
import { RollbackError } from '../../errors/database/rollback-error'
import { TimeoutError } from '../../errors/timeout-error'
import { TransactionError } from '../../errors/database/transaction-error'
import { UniqueConstraintViolationError } from '../../errors/database/unique-constraint-violation-error'

describe('rethrowIf', () => {
  const THROW = true
  const NO_THROW = false
  const noEntError = new Error()
  const noEntCode = 'ENOENT'
  noEntError.code = noEntCode
  const status500Error = new Error()
  status500Error.status = 500

  const isLocalAwareClasses = [
    ConstraintViolationError,
    DatabaseError,
    RollbackError,
    TimeoutError,
    TransactionError,
    UniqueConstraintViolationError,
  ]

  const rethrowTestData = [
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
    [new ExternalServiceError(), { isLocal: false }, THROW],
    [new Error(), { isLocal: false }, NO_THROW],
    [new ArgumentInvalidError(), { isLocal: false }, NO_THROW],
    [new ExternalServiceError(), { isLocal: true }, NO_THROW],
    [new Error(), { isLocal: true }, THROW],
    [new ArgumentInvalidError(), { isLocal: true }, THROW],
  ]

  for (const IlaClass of isLocalAwareClasses) {
    rethrowTestData.push(
      [new IlaClass({ isLocal: true }), { isLocal: true}, THROW],
      [new IlaClass({ isLocal: false }), { isLocal: true}, NO_THROW],
      [new IlaClass({ isLocal: true }), { isLocal: false}, NO_THROW],
      [new IlaClass({ isLocal: false }), { isLocal: false}, THROW],
    )
  }

  test.each(rethrowTestData)(
    'error %p, re-throw options %p => will throw: %p',
    (error, options, expectThrow) => {
      if (expectThrow === THROW) {
        expect(() => rethrowIf(error, options)).toThrow()
      }
      else expect(() => rethrowIf(error, options)).not.toThrow()
    }
  )
})
