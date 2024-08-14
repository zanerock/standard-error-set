import { UniqueConstraintViolationError } from '../unique-constraint-violation-error'

describe('UniqueConstraintViolationError', () => {
  const causeError = new Error()

  test.each([
    [undefined, /Unique constraint violated./, 409, undefined],
    [{ entityType: 'user' }, /Unique constraint on entity type 'user' violated/, 409, undefined],
    [{ entityType: 'user', fieldAndValues: ['email'] }, /Unique constraint on fields <email> on entity type 'user'/, 409, undefined],
    [{ entityType: 'user', fieldAndValues: ['email', ['world','earth']] }, /fields <email,world\(earth\)> on entity type 'user'/, 409, undefined],
    [{ fieldAndValues: ['email', ['world','earth']] }, /fields <email,world\(earth\)> violated/, 409, undefined],
    [{ fieldAndValues: ['email'], status: 400 }, /fields <email> violated/, 400, undefined],
    [{ fieldAndValues: ['email'], cause: causeError }, /fields <email> violated/, 409, causeError],
    [{ fieldAndValues: ['email'], status: 400, cause: causeError }, /fields <email> violated/, 400, causeError],
  ])('Options %p => message matches %p, status %s, cause %s', (options, messageMatcher, expectedStatus, expectedCause) => {
    const error = new UniqueConstraintViolationError(options)
    expect(error.message).toMatch(messageMatcher)
    expect(error.status).toBe(expectedStatus)
    expect(error.cause).toBe(expectedCause)
  })
})