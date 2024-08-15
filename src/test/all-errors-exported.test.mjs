import { readdirSync } from 'node:fs'
import { resolve as resolvePath } from 'node:path'

import camelCase from 'lodash/camelCase' // eslint-disable-line node/no-unpublished-import
import upperFirst from 'lodash/upperFirst' // eslint-disable-line node/no-unpublished-import

// I think this import is what might be confusing eslint into thinking tihs file is published (which is triggering the
// false errors above).
import * as exports from '../index'

test('Check that all errors are exported', () => {
  const srcDir = resolvePath(__dirname, '..')

  const files = readdirSync(srcDir, { withFileTypes : true })
    .filter((dirEnt) => dirEnt.isFile() && !dirEnt.name.startsWith('index.'))

  const missingExports = files.reduce((acc, { name }) => {
    const functionName = camelCase(name.replace(/\.[m|c]?js$/, ''))
    const className = upperFirst(functionName)
    if (!(className in exports) && !(functionName in exports)) {
      acc.push(className)
    }
    return acc
  }, [])

  expect(missingExports).toHaveLength(0)
})
