import { completeTestData } from '../../test/lib/complete-test-data'
import { NotSupportedError } from '../not-supported-error'
import { standardErrorTest } from '../../test/lib/standard-error-test'

describe('NotSupportedError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /^The target does not currently support a requested feature.$/],
    [
      { endpointType: 'URL', endpointName : '/some/endpoint' },
      /^URL '\/some\/endpoint' does not currently support a requested feature\.$/,
    ],
    [
      { missingFeature : 'RFC 3339 style dates', endpointName : 'myFunc()' },
      /^Command 'myFunc\(\)' does not currently support RFC 3339 style dates\.$/,
    ],
    [
      { missingFeature : 'YAML payloads', hint : 'Send request in JSON.' },
      /^The target does not currently support YAML payloads. Send request in JSON\.$/,
    ],
    [
      { message : 'Foo is bad', cause : causeError, status : 400 },
      /^Foo is bad$/,
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
    standardErrorTest(NotSupportedError)
  )
})
