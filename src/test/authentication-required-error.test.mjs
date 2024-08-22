import { completeTestData } from './lib/complete-test-data'
import { AuthenticationRequiredError } from '../authentication-required-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('AuthenticationRequiredError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /Action requires authentication./],
    [{ action : 'endpoint access' }, /Endpoint access requires authentication./],
    [{ action : 'updating', target : 'customer database' }, /Updating the customer database requires authentication./],
    [{ issue : 'requires 2fa' }, /Action requires 2fa./],
    [{ message : 'Foo is bad', cause : causeError, status : 500 }, /Foo is bad/, 500, causeError],
  ]

  test.each(completeTestData({
    testData,
    defaultStatus : 403,
  }))('Options %p => message %s and status %s', standardErrorTest(AuthenticationRequiredError))
})
