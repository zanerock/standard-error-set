import { readdirSync } from 'node:fs'
import { resolve as resolvePath } from 'node:path'

import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

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