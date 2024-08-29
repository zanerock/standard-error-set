import { completeTestData } from '../../test/lib/complete-test-data'
import { NotImplementedError } from '../not-implemented-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('NotImplementedError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /Action not currently implemented./],
    [
      { target : '/some/url/endpoint' },
      /'\/some\/url\/endpoint' is not currently implemented./,
    ],
    [
      { message : 'Foo is bad', cause : causeError, status : 400 },
      /Foo is bad/,
      400,
      causeError,
    ],
  ]

  test.each(
    completeTestData({
      testData,
      defaultStatus : 500,
    })
  )(
    'Options %p => message %s and status %s',
    standardErrorTest(NotImplementedError)
  )
})
