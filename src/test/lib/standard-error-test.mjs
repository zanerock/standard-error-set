/* global expect */

const standardErrorTest =
  (TestClass) =>
  (options, messageMatcher, expectedStatus, expectedCause, expectedCode) => {
    const error = new TestClass(options)
    expect(error.message).toMatch(messageMatcher)
    expect(error.status).toBe(expectedStatus)
    expect(error.cause).toBe(expectedCause)
    expect(error.code).toBe(expectedCode)
    for (const parameter of Object.keys(options || {})) {
      if (!error[parameter]) {
        throw new Error(`Parameter '${parameter}' not defined.`)
      }
    }
  }

export { standardErrorTest }
