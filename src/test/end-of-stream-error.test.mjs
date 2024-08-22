import { completeTestData } from './lib/complete-test-data'
import { EndOfStreamError } from '../end-of-stream-error'
import { standardErrorTest } from './lib/standard-error-test'

describe('EndOfStreamError', () => {
  const causeError = new Error()

  const testData = [
    [undefined, /There was an end-of-stream error./],
    [{ action: 'streaming' }, /There was an end-of-stream error streaming./ ],
    [{ target: 'serial port'}, /There was an end-of-stream error reading the serial port./],
    [{ action: 'streaming', target: 'serial port'}, /There was an end-of-stream error streaming the serial port./],
    [{ issue: 'virtual socket closed', target: 'serial port'}, /There was an end-of-stream error reading the serial port; virtual socket closed./],
    [{ message : 'Foo is bad', cause : causeError, status: 400 }, /Foo is bad/, 400, causeError],
  ]

  test.each(completeTestData({
    testData,
    defaultStatus : 500,
  }))('Options %p => message %s and status %s', standardErrorTest(EndOfStreamError))
})
