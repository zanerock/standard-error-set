# standard-error-set

[![coverage: 100%](./.readme-assets/coverage.svg)](https://github.com/liquid-labs/standard-error-set/pulls?q=is%3Apr+is%3Aclosed)

A collection of common/standard error types to flesh out JavaScript's rather anemic baseline.

This project is currently in beta. There are no known issues and we are using it in several of our own projects without issue. There's at least [one update](https://github.com/liquid-labs/standard-error-set/issues/39) we want to make before promoting to general release.

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
  - [Common constructor options](#common-constructor-options)
  - [Common instance fields](#common-instance-fields)
  - [Message construction](#message-construction)
  - [Error code hoisting](#error-code-hoisting)
  - [API reference](#api-reference)
- [Presenting errors to users](#presenting-errors-to-users)

## Install

```bash
npm i standard-error-set
```

## Usage and use cases

**Create semantically precise errors for better error handling**:

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

**Quickly [test and re-throw errors](#rethrowIf)**:

```js
try {
  parseArgs()
} catch (e) {
  // let non-ArgumentInvalidErrors bubble up
  rethrowIf(e, { notInstanceOf: [ArgumentInvalidError] })
  // handle user input/argument errors:
  process.stdout.write(`ERROR: ${e.message}\n`)
}
```

**[Wrap many standard errors in semantically strong error types](#wrapError)**:

```js
import { wrapError } from '@liquid-labs/common-error' // ESM
// const { wrapError } = require('@liquid-labs/common-error') // CJS

try {
  await fetch('www.foo.com')
} catch (e) {
  throw wrapError(e)[0] // throws type specific based on e.code
}
```

## API

### Common parameters

The following option parameters are accepted by all [`CommonError`](#CommonError) error constructors. We document them here to save space and avoid repeating them for each error class. They are all optional.

- `cause` (`Error`|`undefined`): The error that caused this error. This is useful for wrapping a more generic error in a more specific error or chaining related errors across an error boundary (e.g., asynchronous calls).
- `hint` (`string`|`undefined`): Optional hint regarding how to rectify the error. This should be a complete sentence and, if defined, will be appended to the `message` (whether defined directly or constructed).
- <span id="common-constructor-options-ignore-for-message">`ignoreForMessage`</span> (`string[]|undefined`): When set, the named options name options will be ignored if/when [constructing the message](#message-construction). Ignored values are treated as 'unset' and will either be left out of the message entirely or revert to default values based on the error type. If the special value 'all' is included, then all parameters will be ignored. This is useful when, for instance, you want to hide information from the user about specific resources, actions, required authorizations, etc., but you still want to include these parameters as part of the error instance for logging or other purposes.
- `message` (`string`|`undefined`): All [`CommonError`](#CommonError) classes generate a standard message, based on class specific input parameters (if any). You can always override this message and provide your own custom message.
- `status` (`number`|`undefined`): All [`CommonError`](#CommonError) classes are assigned an HTTP status based on their error type. The mapping between error type and status code can be managed with [`mapErrorToHttpStatus`](#mapErrorToHttpStatus). This would be unusual, but you can instead set the status on a particular `CommonError` instance with this option.

### Common instance fields

All option parameters passed to any [`CommonError`](#CommonError) (or sub-class) constructor are captured as instance fields. E.g.:

```js
const error = new ArgumentInvalidError({ argumentName: 'foo' })
// sets: error.argumentName = 'foo'
```

All `CommonError` and sub-class instances will set `message`, `status`, and `statusName`. `statusName` is always determined by the `status` (which is either explicitly set or [determined by the error type](#mapErrorToHttpStatus)) and the current [status to name mapping](#mapHttpStatusToName).

### Message construction

All [`CommonError`](#CommonError) and `CommonError` sub-classes support parameterized message construction. That is, they will generate a standard message based on class specific parameters unless `message` is explicitly specified on the constructor options. Refer to the class documentation for parameter definition and message examples.

- All non-[common constructor options](#common-constructor-options) are used in message construction. Since common parameters are not included in class documentation, all parameters in the [class documentation](#global-class-index) are used in generating a constructed message. Refer to class documentation for example constructed messages.
- All construction parameters are optional and all `CommonError` and sub-classes will generate a standard class specific message if given no options.
- All constructors take the `hint` option, which, if specified, will be appended to the `message` (whether constructed or specified).
- <span id="message-construction-ignore-parameters">Parameters can be ignored in message construction by setting the [`ignoreForMessage`](#common-constructor-options-ignore-for-message) option.</span>

### Error code hoisting

When the `cause` constructor option defines a `code` instance field, the `code` value is hoisted to the new [`CommonError`](#CommonError) unless overridden by either the `code` or `noHoistCode` option. E.g.:

```js
const cause = new Error()
cause.code = 'ENOENT'
const hoistError = new CommonError({ cause }) // hoistError.code === 'ENOENT'
const codeError = new CommonError({ cause, code: 'EISDIR' }) // codeError.code === 'EISDIR'
const noHoistError = new CommonError({ cause, noHoistCode: true }) // noHoistError.code === undefined
```
