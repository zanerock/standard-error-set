# @liquid-labs/common-errors

A collection of common/standard error types to flesh out Javascripts rather anemic baseline.

___This is beta code.___ It's mostly done, but not all the error types have been fully tested.

## Table of contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [Common parameters](#common-parameters)
  - [Error code hoisting](#error-code-hoisting)
  - [Instance fields](#instance-fields)
  - [API reference](#api-reference)
- [Presenting errors to users](#presenting-errors-to-users)

## Install

```bash
npm i @liquid-labs/common-errors
```

## Usage

```js
import { wrapError } from '@liquid-labs/common-error' // ESM
// const { wrapError } = require('@liquid-labs/common-error') // CJS

try {
  await fetch('www.foo.com')
}
catch (e) {
  throw wrapError(e)[0]
}
```

```js
import { ArgumentTypeError } from '@liquid-labs/common-error' // ESM
// const { ArgumentTypeError } = require('@liquid-labs/common-error') // CJS

const myFunc = ({ arg }) => {
  const typeofArg = typeof arg
  if (typeofArg !== 'string') {
    throw new ArgumentTypeError({ argumentName : 'arg', expectedType : 'string', receivedType : typeofArg })
  }
}
```

## API

### Common parameters

The following option parameters are accepted by all {@link CommonError} error constructors. We document them here to save space and avoid repeating them for each error class. They are all optional.

- `cause` (`Error`|`undefined`): The error that caused this error. This is useful for wrapping a more generic error in a more specific error or chaining related errors across an error boundary (e.g., asynchronous calls).
- `message` (`string`|`undefined`): All {@link CommonError} classes generate a standard message, based on class specific input parameters (if any). You can always override this message and provide your own custom message.
- `status` (`number`|`undefined`): All {@link CommonError} classes are assigned an HTTP status based on their error type. The mapping between error type and status code can be managed with {@link mapErrorToHttpStatus}. This would be unusual, but you can instead set the status on a particular `CommonError` instance with this option.

### Error code hoisting

When the creation option `cause` is an `Error` and defines a `code` instance field, the `code` value is hoisted to the new {@link CommonError} unless the `code` or `noHoistCode` option is set to `true`. E.g.:
```js
const cause = new Error()
exampleError.code = 'ENOENT'
const hoistError = new CommonError({ cause }) // hoistError.code === 'ENOENT'
const codeError = new CommonError({ cause, code: 'EISDIR' }) // codeError.code === 'EISDIR'
const noHoistError = new CommonError({ cause, noHoistError : true }) // noHoistError.code === undefined
```

### Instance fields

All {@link CommonError}s provide the following instance fields:

- `cause` (`Error`|`undefined`): The error that caused this error, if any.
- `code` (`string`|`undefined`): The code (such as 'ENOENT') associated with this error.
- `message` (`string`): The error message.
- `status` (`number`): The HTTP status code.
- `statusName` (`string`): The HTTP status name.

In addition to this, all parameters passed to a `CommonError` constructor will be saved as a member field. E.g., {@link FileNotFoundError} provides fields `dirPath` and `fileName`.
