# standard-error-set

[![coverage: 100%](./.readme-assets/coverage.svg)](https://github.com/liquid-labs/standard-error-set/pulls?q=is%3Apr+is%3Aclosed) [![Unit tests](https://github.com/liquid-labs/standard-error-set/actions/workflows/unit-tests-node.yaml/badge.svg)](https://github.com/liquid-labs/standard-error-set/actions/workflows/unit-tests-node.yaml)

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
###  API reference
_API generated with [dmd-readme-api](https://www.npmjs.com/package/dmd-readme-api)._

<span id="global-class-index"></span>
- Classes:
  - [`CommonError`](#CommonError): A base class for common errors.
  - [`SystemError`](#SystemError): An error indicating a system error.
  - [`TimeoutError`](#TimeoutError): Indicates an operation is taking too much time.
<span id="global-function-index"></span>
- Functions:
  - <span id="global-function-Settings-management-index"></span>_Settings management_
    - [`commonErrorSettings()`](#commonErrorSettings): Used to retrieve and manage options used in [`wrapError`](#wrapError) and [message construction](#message-construction).
    - [`mapErrorToHttpStatus()`](#mapErrorToHttpStatus): Used to translate and manage translation of error names to HTTP status codes.
    - [`mapHttpStatusToName()`](#mapHttpStatusToName): Used to translate and manage mappings from HTTP status codes to names.
    - [`maskNoAccessErrors()`](#maskNoAccessErrors): Remaps [`NoAccessError`](NoAccessError)s (and all children) to a 404 (Not Found) status and changes the generated message.
  - <span id="global-function-Utility-index"></span>_Utility_
    - [`ignoreParameter()`](#ignoreParameter): Determines whether a parameter should be ignored according to the provided options and global settings.
    - [`includeParameterInMessage()`](#includeParameterInMessage): Determines whether, based on parameter value and settings, whether the parameter should be used in creating a constructed message.
    - [`rethrowIf()`](#rethrowIf): One liner to test and re-throw errors if any conditions are met.
    - [`wrapError()`](#wrapError): Wraps an `Error` in a [`CommonError`](#CommonError).

<a id="CommonError"></a>
#### `CommonError` <sup>↱[source code](./staging/common-error.mjs#L28)</sup> <sup>⇧[global class index](#global-class-index)</sup>

A base class for common errors. To create a common error of your own, extend this class.
```js
import { CommonError, registerParent } from 'standard-error-set'
const myName = 'MyError'

export const MyError = class extends CommonError {
  constructor({ name = myName, ...options}) {
    const message = "Now you've done it!"
    super({ name, message, ...options })
  }
}
MyError.typeName = myName

registerParent(myName, Object.getPrototypeOf(MyError).name)
```

If your new error creates a [constructed message](#constructed-message) from parameters, refer to [`includeParameterInMessage`](#includeParameterInMessage) and [`ArgumentInvalidError`](ArgumentInvalidError) source code for an example of how to use it.

__Category__: General errors

<a id="new_CommonError_new"></a>
##### `new CommonError([options])` 

[`CommonError`](#CommonError) constructor.

See the [common constructor options](#common-constructor-options) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| `options.name` | `string` |  | The name of error. In general, this should match the final class name. |
| [`options.message`] | `string` | &#x27;An error has occurred.&#x27; | The error message. |
| [`options.code`] | `string` \| `undefined` |  | The error code. |
| [`options.hint`] | `string` \| `undefined` |  | Optional hint regarding rectifying the error. |
| [`options.status`] | `number` \| `undefined` |  | The HTTP status associated with the error. If undefined,   this will be automatically set according to the [@link mapErrorToHttpStatus | configured error mappings]. |
| [`options.options`] | `object` \| `undefined` |  | The options to pass to the `Error` super-constructor. |

**Example**:
```js
new CommonError() // "An error has occurred."
new CommonError({ message : 'Oh no! An error!' }) // "Oh no! An error!"
```

<a id="SystemError"></a>
#### `SystemError` <sup>↱[source code](./staging/system-error.mjs#L14)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An error indicating a system error. When used to wrap native system errors (like `ReferenceError`, `SyntaxError`,
etc.), be sure to set the `cause` option.

__Category__: General errors

<a id="new_SystemError_new"></a>
##### `new SystemError([options], defaults)` 

[`SystemError`](#SystemError) constructor.

See the [common constructor options](#common-constructor-options) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.issue`] | `string` | &#x27;has experienced a system error&#x27; | A description of the error. |
| [`options.resource`] | `string` | &#x27;process&#x27; | The name or short description of the resource where the error   occurred. |

**Example**:
```js
new SystemError() // "The process has experienced a System."
// v "The application has experienced a stack overflow."
new SystemError({ resource: 'application'})
```

<a id="TimeoutError"></a>
#### `TimeoutError` <sup>↱[source code](./staging/timeout-error.mjs#L12)</sup> <sup>⇧[global class index](#global-class-index)</sup>

Indicates an operation is taking too much time.

__Category__: General errors

<a id="new_TimeoutError_new"></a>
##### `new TimeoutError([options], defaults)` 

[`TimeoutError`](#TimeoutError) constructor.

See the [common constructor options](#common-constructor-options) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.resource`] | `string` \| `undefined` |  | The name or short description of the thing which is   timing out. |
| [`options.isLocal`] | `boolean` | `false` | Indicates whether the error arises from a remote service our not (   e.g., a connection timeout). |

**Example**:
```js
// new TimeoutError() // "The process has timed out."
// new TimeoutError({ resource : 'user session' }) // "The user session has timed out."
```

<a id="commonErrorSettings"></a>
#### `commonErrorSettings(option, value)` ⇒ `*` <sup>↱[source code](./staging/common-error-settings.mjs#L31)</sup> <sup>⇧[global function index](#global-function-index)</sup>

Used to retrieve and manage options used in [`wrapError`](#wrapError) and [message construction](#message-construction).

- To retrieve a setting, call `commonErrorSettings(option)` (where `option` is a `string`).
- To add/override a single setting, call `commonErrorSettings(option, value)`.
- To bulk add/override settings, call `commonErrorSettings(mappings)` (where `mappings is an `Object`).
- To reset the custom settings to default, call `commonErrorSettings()`.

Currently, we support three settings. Two influence the behavior of [`wrapError`](#wrapError) (refer to `wrapError`
documentation for further details):
- `noInstanceHidingOnWrap` - Controls whether or not errors that are not class `Error` are wrapped or not.
- `wrapUserErrorType` - Controls the resulting class when wrapping errors associated with bad user input.

The third option `ignoreForMessage` (an array of string) specifies parameters to ignore when [constructing an error
message](#message-construction). This can be used to hide details from end users.


| Param | Type | Description |
| --- | --- | --- |
| `option` | `string` \| `object` | Then name of the setting, or bulk settings `Object`. |
| `value` | `*` | The value of the setting. The necessary type depends on the `option`. |

**Returns**: `*` - The value of the indicated `option`. The type will depend on the particular `option`.

__Category__: [Settings management](#global-function-Settings-management-index)

<a id="mapErrorToHttpStatus"></a>
#### `mapErrorToHttpStatus(errorRef, status)` ⇒ `number` \| `undefined` <sup>↱[source code](./staging/map-error-to-http-status.mjs#L34)</sup> <sup>⇧[global function index](#global-function-index)</sup>

Used to translate and manage translation of error names to HTTP status codes. You can use this function to add your
own mappings, which may be useful when dealing with non-common error errors.
- To retrieve a status, call `mapErrorToHttpStatus(errorRef)`.
- To add/override a status mapping, call `mapErrorToHttpStatus(errorRef, status)`.
- To bulk add/override status mappings, call `mapErrorToHttpStatus(mappingObject)` where `mappingObject` is an
  `Object<string,true>`.
- To reset the custom mappings to the default mappings, call `mapErrorToHttpStatus()` with no arguments.


| Param | Type | Description |
| --- | --- | --- |
| `errorRef` | `string` \| `Error` \| `CommonError.constructor` \| `Object.<string, true>` | The name, instance, or class   (`instanceof ${linkplain CommonError)`) of the error to either retrieve or set status for, or `Object<   string,true>` `for bulk add/override of the custom mappings. |
| `status` | `number` | An integer value to map the error to. |

**Returns**: `number` \| `undefined` - Returns an integer if retrieving an error to status mapping, otherwise return
  undefined.

__Category__: [Settings management](#global-function-Settings-management-index)

<a id="mapHttpStatusToName"></a>
#### `mapHttpStatusToName(status, name)` ⇒ `string` \| `undefined` <sup>↱[source code](./staging/map-http-status-to-name.mjs#L67)</sup> <sup>⇧[global function index](#global-function-index)</sup>

Used to translate and manage mappings from HTTP status codes to names. Supports all current status defined by the [
IANA](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml), as well as common extensions
returned by IIS, NginX, and Cloudflare.
- To retrieve a status name, call `mapHttpStatusToName(status)` (where `status` is a `string`).
- To add/override a single custom mapping, call `mapHttpStatusToName(status, name)`.
- To bulk add/override custom mappings, call `mapHttpStatusToName(/mappings)` (where `mappings is an `Object`).
- To reset the custom mappings to default, call `mapHttpStatusToName()`.


| Param | Type | Description |
| --- | --- | --- |
| `status` | `number` \| `Object.<number, string>` | Either the status to retrieve or set mapping for, or an   `Object<number,string>` to bulk update mappings. |
| `name` | `string` | The name to map a status onto. |

**Returns**: `string` \| `undefined` - The status name, if known.

__Category__: [Settings management](#global-function-Settings-management-index)

<a id="maskNoAccessErrors"></a>
#### `maskNoAccessErrors()` <sup>↱[source code](./staging/mask-no-access-errors.mjs#L17)</sup> <sup>⇧[global function index](#global-function-index)</sup>

Remaps [`NoAccessError`](NoAccessError)s (and all children) to a 404 (Not Found) status and changes the generated message. This
will effectively remap and custom mappings of [`NoAccessError`](NoAccessError) or it's children that may be in place. This  is a
common practice in secure systems where it is undesirable to give attackers any information about a resource they
don't have access to. I.e., if a user tries to access a resource they are not permitted to access, an unmasked [`NoAccessError`](NoAccessError) would divulge the existence of a resource. Note, this does not change the class of the error itself,
so and developers _should_ continue to use [`NoAccessError`](NoAccessError)s where the problem is actually access. In
production systems, the [presentation of errors to the users](#presenting-errors-to-users) should not indicate the
underlying type.

__Category__: [Settings management](#global-function-Settings-management-index)

<a id="ignoreParameter"></a>
#### `ignoreParameter(parameterName, options)` ⇒ `boolean` <sup>↱[source code](./staging/include-parameter-in-message.mjs#L34)</sup> <sup>⇧[global function index](#global-function-index)</sup>

Determines whether a parameter should be ignored according to the provided options and global settings.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| `parameterName` | `string` |  | The name of the parameter to check. |
| `options` | `object` |  | The (relevant) constructor options. |
| [`options.ignoreForMessage`] | `Array.<string>` | `[]` | List of parameter names which should be ignored in [constructed   error messages](#message-construction). Ignored parameter values revert to default or `undefined`. |

**Returns**: `boolean` - A boolean indicating whether the named parameter should be ignored or not.

__Category__: [Utility](#global-function-Utility-index)

<a id="includeParameterInMessage"></a>
#### `includeParameterInMessage(parameterName, options)` ⇒ `boolean` <sup>↱[source code](./staging/include-parameter-in-message.mjs#L13)</sup> <sup>⇧[global function index](#global-function-index)</sup>

Determines whether, based on parameter value and settings, whether the parameter should be used in creating a
constructed message. If the parameter value is undefined or an empty array, then it is not included. Otherwise,
`options.ignoreForMessage` or, if that is not defined, the common settings 'ignoreForMessage' setting is checked to
see if the `parameterName` is included.


| Param | Type | Description |
| --- | --- | --- |
| `parameterName` | `string` | The name of the parameter to check. |
| `options` | `object` | The (relevant) constructor options. |

**Returns**: `boolean` - A boolean indicating whether to include the parameter in the message construction or not.

__Category__: [Utility](#global-function-Utility-index)

<a id="rethrowIf"></a>
#### `rethrowIf([error], [testOptions])` ⇒ `Error` \| `undefined` <sup>↱[source code](./staging/rethrow-if.mjs#L34)</sup> <sup>⇧[global function index](#global-function-index)</sup>

One liner to test and re-throw errors if any conditions are met.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`error`] | `Error` \| `undefined` |  | The `Error` to test against and possibly re-throw. |
| [`testOptions`] | `object` | `{}` | The set of conditions to test against. If any of the conditions test true, then   the error` is re-thrown. |
| [`testOptions.codeIs`] | `string` \| `Array.<string>` \| `undefined` |  | Throws if `error.code` is _any_ of the   listed codes. |
| [`testOptions.codeIsNot`] | `string` \| `Array.<string>` \| `undefined` |  | Throws if `error.code` is _not any_ of   the listed codes. |
| [`testOptions.instanceOf`] | `function` \| `Array.<function()>` \| `undefined` |  | Throws if `error` is an   instance of _any_ of the listed classes. |
| [`testOptions.instanceOfNot`] | `function` \| `Array.<function()>` \| `undefined` |  | Throws if `error` is not   an instance of _any_ of the listed classes. |
| [`testOptions.isLocal`] | `boolean` \| `undefined` |  | If set, then tests whether the error is marked as   'isLocal' or not. Errors that do not expose this field directly are always considered local, except for instances   of [`ExternalServiceError`](ExternalServiceError), which are always considered remote. |
| [`testOptions.statusGt`] | `number` \| `undefined` |  | Throws if `error.status` is defined and status is   _greater than_ the specified status. |
| [`testOptions.statusGte`] | `number` \| `undefined` |  | Throws if `error.status` is defined and status is   _greater than or equal_ to the  specified status. |
| [`testOptions.statusLt`] | `number` \| `undefined` |  | Throws if `error.status` is defined and status is   _less than_ the specified status. |
| [`testOptions.statusLte`] | `number` \| `undefined` |  | Throws if `error.status` is defined and status is   _less than or equal_ to the  specified status. |
| [`testOptions.statusIs`] | `number` \| `Array.<number>` \| `undefined` |  | Throws if `error.status` is defined and   _any_ of the specified statuses. |
| [`testOptions.statusIsNot`] | `number` \| `Array.<number>` \| `undefined` |  | Throws if `error.status` is defined   and _not any_ of the specified statuses. |

**Returns**: `Error` \| `undefined` - - If the function does not throw, it returns the `error`.

__Category__: [Utility](#global-function-Utility-index)

<a id="wrapError"></a>
#### `wrapError(error, options)` ⇒ `Array.<Error, boolean>` <sup>↱[source code](./staging/wrap-error.mjs#L48)</sup> <sup>⇧[global function index](#global-function-index)</sup>

Wraps an `Error` in a [`CommonError`](#CommonError). The `error` parameter will be set as the `cause` field of the new
`CommonError` instance (unless `cause` is specifically set in the `options`).

The wrapping logic is as follows:
- If the `noInstanceHidingOnWrap` is `true` and the `error` class is anything but `Error`
  (`error.name !== 'Error'`), then results in the original error.
- If the `error` `code` indicates a connection error, results in a [`ConnectionError`](ConnectionError).
- If the `error` `code` is 'EACCESS' or 'EPERM', results in a [`NoAccessError`](NoAccessError).
- If the `error` `code` is 'ENOENT', results in a [`NotFoundError`](NotFoundError).
- If the `error` is an instance of `URIError` and the `wrapUserErrorType` option is `undefined`, results in a
  [`ArgumentInvalidError`](ArgumentInvalidError).
- If the `error` is an instance of `RangeError` and the `wrapUserErrorType` option is `undefined`, results in a
  [`ArgumentOutOfRangeError`](ArgumentOutOfRangeError).
- If the `error` is an instance of `TypeError` and the `wrapUserErrorType` option is `undefined`, results in a
  [`ArgumentTypeError`](ArgumentTypeError).
- If the `error` in an instance of `ReferenceError` or `SyntaxError`, results in a [`SystemError`](#SystemError).
- Otherwise, results in a [`CommonError`](#CommonError).

Note, there is no special handling for `EvalError` (which [is no longer in
use](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError)) or `CommonError`
(which is
[non-standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/InternalError)).


| Param | Type | Description |
| --- | --- | --- |
| `error` | `Error` | The `Error` to be wrapped. |
| `options` | `object` \| `undefined` | The options controlling some wrapping and also passed to the wrapping   `CommonError`constructor. |
| `options.noInstanceHidingOnWrap` | `boolean` | If true, then if the `error` class is anything but `Error`, the   original `error` will be return as is. If `undefined`, then the logic will refer to the [`commonErrorSettings`](#commonErrorSettings) `noInstanceHidingOnWrap` option value. |
| `options.wrapUserErrorType` | `function` | If set, then `URIError`, `RangeError`, and `TypeError` will be wrapped   in a new error of that `Class`. Otherwise, the logic will refer to the [`commonErrorSettings`](#commonErrorSettings)   `wrapUserErrorType`, which if undefined will result in the appropriate [`ArgumentInvalidError`](ArgumentInvalidError) analog. |

**Returns**: `Array.<Error, boolean>` - An array containing either the original `Error` or the new wrapping `CommonError`
  and a boolean indicating whether the `error` was wrapped (`true`) or not (`false`).

__Category__: [Utility](#global-function-Utility-index)

## Presenting errors to users

In a production system, the user should only see the error message, and additional information about the type of the error or where it occurred should not be passed on. This includes in response data which might not be directly displayed to the user, but could be accessed by inspecting the HTTP result, for instance. In particular, the class type and stack trace _should not_ be included in any error response. If this protocol is adopted, then [`maskNoAccessErrors`](#maskNoAccessErrors) _may_ be used.

If this information will be included in response data, then high security systems _should_ use [`NotFoundError`](#NotFoundError) and it's children directly, even when the real problem is one off authorization. In this case, [`maskNoAccessErrors`](#maskNoAccessErrors) _should not_ be used.
