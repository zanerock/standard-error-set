# @liquid-labs/common-errors
[![coverage: 100%](./.readme-assets/coverage.svg)](https://github.com/liquid-labs/standard-error-set/pulls?q=is%3Apr+is%3Aclosed)

A collection of common/standard error types to flesh out Javascripts rather anemic baseline.

## Features

- Set of expressive, semantic [error classes](#api-reference).
- Built in, [configurable HTTP status codes](#mapErrorToHttpStatus) and [names](#mapHttpStatusToName).
- All classes support standard, parameterized [constructed](#message-construction) and full custom messages.
- [Automatically wrap](#wrapError) standard `Error` classes and codes in semantically strong `Error`s.
- One-line [re-throw testing](#rethrowIf).

## Table of contents

- [Features](#features)
- [Install](#install)
- [Usage and use cases](#usage-and-use-cases)
- [API](#api)
  - [Common parameters](#common-parameters)
  - [Common Instance fields](#instance-fields)
  - [Error code hoisting](#error-code-hoisting)
  - [Message construction](#message-construction)
  - [API reference](#api-reference)
- [Presenting errors to users](#presenting-errors-to-users)

## Install

```bash
npm i @liquid-labs/common-errors
```

## Usage and use cases

__Create semantically precise errors for better error handling__:
```js
import { ArgumentTypeError } from '@liquid-labs/common-error' // ESM
// const { ArgumentTypeError } = require('@liquid-labs/common-error') // CJS

const parseArgs = ({ arg = process.argv }) => {
  const typeofArg = typeof arg
  if (typeofArg !== 'string') {
    throw new ArgumentTypeError({ argumentName : 'arg', argumentType : 'string', receivedType : typeofArg })
  }
  ...
  return options
}
```

__Quickly [test and re-throw errors](#rethrowIf)__:
```js
try {
  parseArgs()
}
catch (e) {
  // let non-ArgumentInvalidErrors bubble up
  rethrowIf(e, { notInstanceOf: [ArgumentInvalidError] })
  // handle user input/argument errors:
  process.stdout.write(`ERROR: ${e.message}\n`)
}
```

__[Wrap many standard errors in semantically strong error types](#wrapError)__:
```js
import { wrapError } from '@liquid-labs/common-error' // ESM
// const { wrapError } = require('@liquid-labs/common-error') // CJS

try {
  await fetch('www.foo.com')
}
catch (e) {
  throw wrapError(e)[0] // throws type specific based on e.code
}
```

## API

### Common parameters

The following option parameters are accepted by all [`CommonError`](#CommonError) error constructors. We document them here to save space and avoid repeating them for each error class. They are all optional.

- `cause` (`Error`|`undefined`): The error that caused this error. This is useful for wrapping a more generic error in a more specific error or chaining related errors across an error boundary (e.g., asynchronous calls).
- `hint` (`string`|`undefined`): Optional hint regarding how to rectify the error. This should be a complete sentence and, if defined, will be appended to the `message` (whether defined directly or constructed).
- `message` (`string`|`undefined`): All [`CommonError`](#CommonError) classes generate a standard message, based on class specific input parameters (if any). You can always override this message and provide your own custom message.
- `status` (`number`|`undefined`): All [`CommonError`](#CommonError) classes are assigned an HTTP status based on their error type. The mapping between error type and status code can be managed with [`mapErrorToHttpStatus`](#mapErrorToHttpStatus). This would be unusual, but you can instead set the status on a particular `CommonError` instance with this option.

### Instance fields

All option parameters passed to any [`CommonError`](#CommonError) (or sub-class) constructor are captured as instance fields. E.g.: 
```js
const error = new ArgumentInvalidError({ argumentName: 'foo' })
// sets: error.argumentName = 'foo'
```

All `CommonError` and sub-class instances will set `message`, `status`, and `statusName`. `statusName` is always determined by the `status` (which is either explicitly set or [determined by the error type](#mapErrorToHttpStatus)) and the current [status to name mapping](#mapHttpStatusToName).

### Message construction

All [`CommonError`](#CommonError) and `CommonError` sub-classes support parameterized message construction. That is, they will generate a standard message based on class specific parameters unless `message` is explicitly specified on the constructor options. Refer to the class documentation for parameter definition and message examples.

- All non-[common parameter](#common-parameters) constructor options are used in message construction. Since common parameters are not included in class documentation, all parameters in the [class documentation](#global-class-index) are used in generating a constructed message. Refer to class documentation for example constructed messages.
- All construction parameters are optional and all `CommonError` and sub-classes will generate a class specific (but otherwise generic) message if given no options.
- All constructors take the `hint` option, which, if specified, will be appended to the `message` (whether constructed or specified).

### Error code hoisting

When the `cause` constructor option defines a `code` instance field, the `code` value is hoisted to the new [`CommonError`](#CommonError) unless overridden by setting the `code` option or by setting the `noHoistCode` option to `true`. E.g.:
```js
const cause = new Error()
cause.code = 'ENOENT'
const hoistError = new CommonError({ cause }) // hoistError.code === 'ENOENT'
const codeError = new CommonError({ cause, code: 'EISDIR' }) // codeError.code === 'EISDIR'
const noHoistError = new CommonError({ cause, noHoistCode : true }) // noHoistError.code === undefined
```

