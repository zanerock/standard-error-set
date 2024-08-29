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
  - [Message construction](#message-construction)
  - [Error code hoisting](#error-code-hoisting)
  - [API reference](#api-reference)
- [Presenting errors to users](#presenting-errors-to-users)

## Install

```bash
npm i @liquid-labs/common-errors
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
- <span id="common-parameters-ignore-for-message">`ignoreForMessage`</span> (`string[]|undefined`): When set, the named options name options will be ignored if/when [constructing the message](#message-construction). Ignored values are treated as 'unset' and will either be left out of the message entirely or revert to default values based on the error type. If the special value 'all' is included, then all parameters will be ignored. This is useful when, for instance, you want to hide information from the user about specific resources, actions, required authorizations, etc., but you still want to include these parameters as part of the error instance for logging or other purposes.
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
- All construction parameters are optional and all `CommonError` and sub-classes will generate a standard class specific message if given no options.
- All constructors take the `hint` option, which, if specified, will be appended to the `message` (whether constructed or specified).
- <span id="message-construction-ignore-parameters">Parameters can be ignored in message construction by setting the [`ignoreForMessage`](#common-parameters-ignore-for-message) option.</span>

### Error code hoisting

When the `cause` constructor option defines a `code` instance field, the `code` value is hoisted to the new [`CommonError`](#CommonError) unless overridden by setting the `code` option or by setting the `noHoistCode` option to `true`. E.g.:

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
  - [`ArgumentInvalidError`](#ArgumentInvalidError): Indicates an invalid argument which by default is interpreted as a user supplied argument/input.
  - [`ArgumentMissingError`](#ArgumentMissingError): An [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating a argument is missing or empty which by default is interpreted as a user supplied argument/input.
  - [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError): An [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating a (typically user supplied) argument is of the correct time, but outside the acceptable range.
  - [`ArgumentTypeError`](#ArgumentTypeError): An [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating a (typically user supplied) argument is not the correct type.
  - [`AuthenticationRequiredError`](#AuthenticationRequiredError): An [`AuthError`](#AuthError) sub-class indicating that an operation requires an authenticated user and the current us not authenticated.
  - [`AuthError`](#AuthError): A generic error indicating a problem with user authentication or authorization.
  - [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError): An [`AuthError`](#AuthError) indicating that the user is authorized to perform some action under some circumstances, but additional conditions must be met.
  - [`CommonError`](#CommonError): A base class for common errors.
  - [`ConnectionError`](#ConnectionError): An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem with a connection, including making a connection.
  - [`ConstraintViolationError`](#ConstraintViolationError): Indicates the requested operation is well formed and the data otherwise correct, but it violates a data constraint.
  - [`DatabaseError`](#DatabaseError): Indicates a problem within a database system implementation.
  - [`DataServiceError`](#DataServiceError): An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem related to a data service specifically.
  - [`DirectoryNotFoundError`](#DirectoryNotFoundError): A [`NotFoundError`](#NotFoundError) sub-type indicating there is no file at the requested location.
  - [`EndOfStreamError`](#EndOfStreamError): An [`IoError`](#IoError) sub-type indicating an attempt to read beyond the of a stream.
  - [`ExternalServiceError`](#ExternalServiceError): Indicates an error related to an external service.
  - [`FileLoadError`](#FileLoadError): An [`IoError`](#IoError) indicating a file is present, and can be read, but there is a problem loading it.
  - [`FileNotFoundError`](#FileNotFoundError): A [`NotFoundError`](#NotFoundError) sub-type indicating there is no file at the requested location.
  - [`IoError`](#IoError): A generic local I/O error _not_ involving a missing resource.
  - [`LocalRollbackError`](#LocalRollbackError): An [`DatabaseError`](#DatabaseError) sub-type relating to a failed rollback within a database.
  - [`LocalTransactionError`](#LocalTransactionError): An [`DatabaseError`](#DatabaseError) indicating a problem creating or otherwise involving a transaction within a database system itself.
  - [`NoAccessDirectoryError`](#NoAccessDirectoryError): An [`NoAccessError`](#NoAccessError) indicating a user lacks the rights to access a particular directory.
  - [`NoAccessError`](#NoAccessError): An [`AuthError`](#AuthError) indicating a user lacks the rights to access a particular resource.
  - [`NoAccessFileError`](#NoAccessFileError): An [`NoAccessError`](#NoAccessError) indicating a user lacks the rights to access a particular file.
  - [`NotFoundError`](#NotFoundError): An error indicating a resource or entity cannot be found.
  - [`NotImplementedError`](#NotImplementedError): An error indicating the requested operation is not currently implemented.
  - [`NotSupportedError`](#NotSupportedError): An error indicating that the resource exists, but does not support some aspect of the request as is.
  - [`OperationNotPermittedError`](#OperationNotPermittedError): An [`AuthError`](#AuthError) indicating the user lacks authorization to perform some operation.
  - [`RollbackError`](#RollbackError): A [`DataServiceError`](#DataServiceError) relating to a failed rollback attempt on an external data service.
  - [`SystemError`](#SystemError): An error indicating a system error.
  - [`TimeoutError`](#TimeoutError): Indicates an operation is taking too much time.
  - [`TransactionError`](#TransactionError): A [`DataServiceError`](#DataServiceError) sub-type indicating a problem with creating or working with a transaction.
  - [`UnavailableError`](#UnavailableError): An error indicating that the resource exists, but is not currently available.
  - [`UniqueConstraintViolationError`](#UniqueConstraintViolationError): A [`ConstraintViolationError`](#ConstraintViolationError) sub-type indicating violation of a unique constraint, such as login ID.
<span id="global-function-index"></span>
- Functions:
  - [`commonErrorSettings()`](#commonErrorSettings): Used to retrieve and manage options used in [`wrapError`](#wrapError) and [message construction](#message-construction).
  - [`mapErrorToHttpStatus()`](#mapErrorToHttpStatus): Used to translate and manage translation of error names to HTTP status codes.
  - [`mapHttpStatusToName()`](#mapHttpStatusToName): Used to translate and manage mappings from HTTP status codes to names.
  - [`maskNoAccessErrors()`](#maskNoAccessErrors): Remaps [`NoAccessError`](#NoAccessError)s (and all children) to a 404 (Not Found) status and changes the generated message.
  - [`rethrowIf()`](#rethrowIf): One liner to test and re-throw errors if any conditions are met.
  - [`wrapError()`](#wrapError): Wraps an `Error` in a [`CommonError`](#CommonError).

<a id="ArgumentInvalidError"></a>
#### `ArgumentInvalidError` <sup>↱[source code](./src/argument-invalid-error.mjs#L36)</sup> <sup>⇧[global class index](#global-class-index)</sup>

Indicates an invalid argument which by default is interpreted as a user supplied argument/input.

#### Setting and interpreting `InvalidArgumentError` status

By convention, you can disambiguate user supplied arguments vs internally supplied (e.g., from code or a service) by
setting and looking at the error `status`. A status of 400 indicates bad user input, while a status of 500 would
indicate an internal problem. This is important in error handling since the message to a user is different if they
can correct the input and retry vs. a problem which is internal and the user has no control over.

If your system does not deal with user input or otherwise wishes to default `InvalidArgumentError` instances to a
different status code, use [`mapErrorToHttpStatus`](#mapErrorToHttpStatus). Just note that this will change the default status code for
all `ArgumentInvalidError` instances, even those created in other packages/libraries.

#### Alternate error classes

Consider whether any of the following errors might be more precise or better suited:
- [`ArgumentMissingError`](#ArgumentMissingError) - For when the argument is required, but missing or empty.
- [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError) - For when the argument is of the proper type, but outside the acceptable range.
- [`ArgumentTypeError`](#ArgumentTypeError) - Indicates an argument is an incorrect type.

<a id="new_ArgumentInvalidError_new"></a>
##### `new ArgumentInvalidError([options], defaults)` 

The [`ArgumentInvalidError`](#ArgumentInvalidError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.endpointType`] | `string` | &#x27;command&#x27; | The type of "endpoint" consuming the argument. |
| [`options.packageName`] | `string` \| `undefined` |  | The package name. |
| [`options.endpointName`] | `string` \| `undefined` |  | The endpoint name. |
| [`options.argumentName`] | `string` \| `undefined` |  | The argument name. |
| [`options.argumentType`] | `string` \| `undefined` |  | The argument type. |
| [`options.argumentValue`] | `*` |  | The argument value. Because this is value is ignored when `undefined`,   consider using the string 'undefined' if it's important to display the value. |
| [`options.issue`] | `string` | &#x27;is invalid&#x27; | The issue with the argument. |

**Example**:
```js
new ArgumentInvalidError() // "Function argument is invalid."
"Function 'my-package#foo()' argument  is invalid."
new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo'})
"Function argument 'bar' cannot be parsed."
new ArgumentInvalidError({ argumentName: 'bar', issue: 'cannot be parsed'})
"Function 'my-package#foo()' argument 'bar' with value '100' is invalid."
new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo', argumentName: 'bar', argumentValue: 100 })
// v "Function argument 'bar' is invalid."
new ArgumentInvalidError({ endpointType: 'function', argumentName: 'bar' })
```

<a id="ArgumentMissingError"></a>
#### `ArgumentMissingError` <sup>↱[source code](./src/argument-missing-error.mjs#L36)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating a argument is missing or empty which by default is interpreted
as a user supplied argument/input. See discussion on [setting and interpreting `InvalidArgumentError`
status](#setting-and-interpreting-invalidargumenterror-status) for more detail.

<span id="argument-missing-error-custom-issue-logic"></span>
If using the class parameters to [construct the error message](#message-construction), where `issue` is not set and 
`argumentValue` is specified, `ArgumentMissingError` determines the default `issue` based on the value of 
`argumentValue`. The logic recognizes `null`, `undefined`, '' (the empty string), `{}` (empty object), and `[]` (
empty array). E.g., `argumentValue = null` yields issue `issue = "is 'null'"`.

If your code has a different concept of what constitutes an "empty" argument, you'll need to specify the `issue` 
parameter in the constructor options. E.g., `{ issue: "field 'foo' is not defined" }`.

Since the argument value is implied in the issue and stating the value would be redundant, when the `issue` is
automatically customized and `ignoreForMessage` is not defined, the logic will set `ignoreForMessage =
['argumentValue']` or merge `['argumentValue']` with any [globally configured 
`ignoreForMessage` option](#commonErrorSettings). To suppress this behavior, pass in an explicit `ignoreForMessage` (an empty array and
`undefined` are equivalent). If you want to be sure and maintain the global settings, set `ignoreForMessage` to
`commonErrorSettings('ignoreForMessage')`.

Consider whether any of the following errors might be more precise or better suited:
- [`ArgumentInvalidError`](#ArgumentInvalidError) - General argument error when no more specific error fits.
- [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError) - Indicates an argument is of the correct type, but outside the acceptable range.
- [`ArgumentTypeError`](#ArgumentTypeError) - Indicates an argument is an incorrect type.

<a id="new_ArgumentMissingError_new"></a>
##### `new ArgumentMissingError([options], defaults)` 

The [`ArgumentMissingError`](#ArgumentMissingError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.endpointType`] | `string` | &#x27;command&#x27; | The type of "endpoint" consuming the argument. |
| [`options.packageName`] | `string` \| `undefined` |  | The package name. |
| [`options.endpointName`] | `string` \| `undefined` |  | The endpoint name. |
| [`options.argumentName`] | `string` \| `undefined` |  | The argument name. |
| [`options.argumentType`] | `string` \| `undefined` |  | The argument type. |
| [`options.argumentValue`] | `*` |  | The argument value. Because this is value is ignored when `undefined`,   consider using the string 'undefined' if it's important to display the value. |
| [`options.issue`] | `string` | (&#x27;is missing or empty&#x27;\|&lt;other&gt;) | The issue with the argument. The default    value is determined by the value (or absence) of `argumentValue`. Refer to [discussion of customized issue    logic](#argument-missing-error-custom-issue-logic) for details. |

**Example**:
```js
new ArgumentInvalidError() // "Function argument is missing or empty."
//  "Function 'my-package#foo()' argument is missing or empty."
new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo'})
//  "Function 'my-package#foo()' argument with value 'undefined' is missing or empty."
new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo', argumentName: 'bar', argumentValue: 'undefined' })
// v "Function argument 'bar' is missing or empty."
new ArgumentInvalidError({ endpointType: 'function', argumentName: 'bar' })
```

<a id="ArgumentOutOfRangeError"></a>
#### `ArgumentOutOfRangeError` <sup>↱[source code](./src/argument-out-of-range-error.mjs#L25)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating a (typically user supplied) argument is of the correct time, but
outside the  acceptable range. Refer to [`ArgumentInvalidError`](#ArgumentInvalidError) for handling of internal argument errors.

The [`includeForMessage`](#common-parameters-ignore-for-message] option for this function recognizes the special
'boundary' value. If included, then the entire boundary description (based on the `max`, `min`, etc. options) will
be suppressed. And while it is possible to exclude the individual boundary parameters, excluding a subset would be
strange.

Consider whether any of the following errors might be more precise or better suited:
- [`ArgumentInvalidError`](#ArgumentInvalidError) - General argument error when no more specific error fits.
- [`ArgumentMissingError`](#ArgumentMissingError) - For when the argument is required, but missing or empty.
- [`ArgumentTypeError`](#ArgumentTypeError) - Indicates an argument is an incorrect type.

<a id="new_ArgumentOutOfRangeError_new"></a>
##### `new ArgumentOutOfRangeError([options], defaults)` 

The [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.endpointType`] | `string` | &#x27;command&#x27; | The type of "endpoint" consuming the argument. |
| [`options.packageName`] | `string` \| `undefined` |  | The package name. |
| [`options.endpointName`] | `string` \| `undefined` |  | The endpoint name. |
| [`options.argumentName`] | `string` \| `undefined` |  | The argument name. |
| [`options.argumentType`] | `string` \| `undefined` |  | The argument type. |
| [`options.argumentValue`] | `*` |  | The argument value. Because this is value is ignored when `undefined`,   consider using the string 'undefined' if it's important to display the value. |
| [`options.max`] | `string` \| `number` \| `undefined` |  | The maximum value; the value must be less than or   equal to this. |
| [`options.maxBoundary`] | `string` \| `number` \| `undefined` |  | The upper value boundary; the value must be   less than this. This value will be ignored if `max` is set. |
| [`options.min`] | `string` \| `number` \| `undefined` |  | The minimum; the value must be greater than or equal   to this. |
| [`options.minBoundary`] | `string` \| `number` \| `undefined` |  | The lower value boundary; the value must be   greater than this. This value will be ignored if `min` is set. |
| [`options.issue`] | `string` | &#x27;is out of range&#x27; | The issue with the argument. |

**Example**:
```js
new ArgumentOutOfRangeError() // "Function argument is out of range."
//  "Function 'foo()' argument is out of range. Value must be greater than or equal to 24."
new ArgumentOutOfRangeError({ endpointName: 'foo', argumentValue: 12, min: 24 })
//  "Function argument 'bar' with value '100' is out of range. Value must be greater than or equal to 'C' and less than 'D'."
new ArgumentInvalidError({ argumentName: 'bar', argumentValue: 'Bob', min: 'C', maxBoundary: 'D' })
// v "Function argument 'bar' is out of range."
new ArgumentInvalidError({ endpointType: 'function', argumentName: 'bar' })
```

<a id="ArgumentTypeError"></a>
#### `ArgumentTypeError` <sup>↱[source code](./src/argument-type-error.mjs#L22)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating a (typically user supplied) argument is not the correct type.
Refer to [`ArgumentInvalidError`](#ArgumentInvalidError) for handling of internal argument errors.

Consider whether any of the following errors might be more precise or better suited:
- [`ArgumentInvalidError`](#ArgumentInvalidError) - General argument error when no more specific error fits.
- [`ArgumentMissingError`](#ArgumentMissingError) - Indicates the argument is missing or empty.
- [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError) - Indicates an argument is of the correct type, but outside the acceptable range.

<a id="new_ArgumentTypeError_new"></a>
##### `new ArgumentTypeError([options], defaults)` 

The [`ArgumentTypeError`](#ArgumentTypeError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.endpointType`] | `string` | &#x27;command&#x27; | The type of "endpoint" consuming the argument. |
| [`options.packageName`] | `string` \| `undefined` |  | The package name. |
| [`options.endpointName`] | `string` \| `undefined` |  | The endpoint name. |
| [`options.argumentName`] | `string` \| `undefined` |  | The argument name. |
| [`options.argumentType`] | `string` \| `undefined` |  | The (expected) argument type. |
| [`options.receivedType`] | `string` \| `undefined` |  | The actual type of the argument. If this is not   set, but `argumentValue` is provided then unless `receivedType` is ignored, the `typeof argumentValue` will be   used as the received type. |
| [`options.argumentValue`] | `*` |  | The value of the argument; though we recommend to leave this   undefined. The value is generally not important since the type is incorrect. |
| [`options.issue`] | `string` | &#x27;is wrong type&#x27; | The issue with the argument. |

**Example**:
```js
new ArgumentInvalidError() // "Function argument is wrong type."
//  "Function 'my-package#foo()' argument is wrong type."
new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo'})
//  "Function 'my-package#foo()' argument with value 'undefined' is wrong type."
new ArgumentInvalidError({ packageName: 'my-package', endpointName: 'foo', argumentName: 'bar', argumentValue: 'undefined' })
// v "Function argument 'bar' is wrong type."
new ArgumentInvalidError({ endpointType: 'function', argumentName: 'bar' })
```

<a id="AuthenticationRequiredError"></a>
#### `AuthenticationRequiredError` <sup>↱[source code](./src/authentication-required-error.mjs#L14)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`AuthError`](#AuthError) sub-class indicating that an operation requires an authenticated user and the current us not
authenticated.

<a id="new_AuthenticationRequiredError_new"></a>
##### `new AuthenticationRequiredError([options], defaults)` 

[`AuthenticationRequiredError`](#AuthenticationRequiredError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.action`] | `string` | &#x27;action&#x27; | A short description of the action. |
| [`options.target`] | `string` \| `undefined` |  | A short description of the action target. |
| [`options.issue`] | `string` | &#x27;requires authorization&#x27; | The auth issue. |

**Example**:
```js
new AuthenticationRequiredError() // "Action requires authentication."
new AuthenticationRequiredError({ action : 'endpoint access' }) // "Endpoint access requires authentication."
// v "Updating the customer database requires authentication."
new AuthenticationRequiredError({ action : 'updating', target : 'customer database' })
```

<a id="AuthError"></a>
#### `AuthError` <sup>↱[source code](./src/auth-error.mjs#L20)</sup> <sup>⇧[global class index](#global-class-index)</sup>

A generic error indicating a problem with user authentication or authorization. `AuthError` should generally not be
used directly, but instead is intended as a base class for auth related errors allowing consumers to check for auth
related errors broadly (`e.g., instanceof AuthError`). Generally, will want to use one of the following:
- [`AuthenticationRequiredError`](#AuthenticationRequiredError)
- [`BadCredentialsError`](BadCredentialsError)
- [`NoAccessError`](#NoAccessError)
- [`OperationNotPermittedError`](#OperationNotPermittedError)

<a id="new_AuthError_new"></a>
##### `new AuthError([options], defaults)` 

[`AuthError`](#AuthError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.action`] | `string` | &#x27;action&#x27; | A short description of the action. |
| [`options.target`] | `string` \| `undefined` |  | The name or short description of the target. |
| [`options.issue`] | `string` | &#x27;is not authorized&#x27; | The auth issue. |

**Example**:
```js
new AuthError() // "Action is not authorized."
new AuthError({ action : 'dancing' }) // "Dancing is not authorized."
new AuthError({ issue : 'is not permitted' }) // Action is not permitted.
```

<a id="AuthorizationConditionsNotMetError"></a>
#### `AuthorizationConditionsNotMetError` <sup>↱[source code](./src/authorization-conditions-not-met-error.mjs#L21)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`AuthError`](#AuthError) indicating that the user is authorized to perform some action under some circumstances, but
additional conditions must be met. The blocking or necessary conditions should be described if possible.

Consider whether any of the following errors might be more precise or better suited:
- [`AuthenticationRequiredError`](#AuthenticationRequiredError) - Use this when the resource requires authenticated access and the user is not
  currently authenticated.
- [`NoAccessError`](#NoAccessError) - Use this when the user is accessing a resource the user has no authorizations to.
- [`OperationNotPermittedError`](#OperationNotPermittedError) - Use this when user is attempting an operation for which they have no
  authorization.

<a id="new_AuthorizationConditionsNotMetError_new"></a>
##### `new AuthorizationConditionsNotMetError([options], defaults)` 

Constructor for the [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError).

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.action`] | `string` \| `undefined` |  | A description of the action being taken. This should   identify the target resource/entity where appropriate. E.g., 'accessing the database' or 'updating customer   data'. |
| [`options.hint`] | `string` \| `undefined` |  | A description of what the user might do to remedy the   situation. This should be a complete sentence. E.g., 'You may contact customer service and request a quota   increase.', or 'Try again in a few minutes.' |
| [`options.issue`] | `string` | &#x27;current conditions prevent this action&#x27; | A description of the problem. E.g.,   'the user is over request quota', or 'this operation is only allowed between 0900 and 1700'. |

**Example**:
```js
new AuthorizationConditionsNotMet() // "While generally authorized, current conditions prevent this action."
// v "While generally authorized to access customer data, current conditions prevent this action."
new AuthorizationConditionsNotMet({ action: 'access customer data' })
// v "While generally authorized, user is over rate quota."
new AuthorizationConditionsNotMet({ issue: 'user is over rate quota' })
// v "While generally authorized to access customer data, user is over rate quota."
new AuthorizationConditionsNotMet({ action: 'access customer data', issue: 'user is over rate quota' })
// v "While generally authorized, current conditions prevent this action. Try again in a few minutes."
new AuthorizationConditionsNotMet({ hint: 'Try again in a few minutes.' })
```

<a id="CommonError"></a>
#### `CommonError` <sup>↱[source code](./src/common-error.mjs#L20)</sup> <sup>⇧[global class index](#global-class-index)</sup>

A base class for common errors. To create a common error of your own, extend this class.
```js
const myName = 'MyError'

export const MyError = class extends CommonError {
  constructor(foo, options) {
    const message = `You hit ${foo}!`
    super(name, message, options)
  }
}
MyError.typeName = myName
```

<a id="new_CommonError_new"></a>
##### `new CommonError([options])` 

[`CommonError`](#CommonError) constructor.


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

<a id="ConnectionError"></a>
#### `ConnectionError` <sup>↱[source code](./src/connection-error.mjs#L18)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem with a connection, including making a connection. The
standard instance `message` is determined by the `code` instance field, which indicates the specific nature of the
connection error. Recall that due to [error code hoisting](#error-code-hoisting), the `code` of the `cause` `Error`
will set the `ConnectionError` `code` (unless the constructor options `code` is set or `noHoistCode` is `true`) and
the hoisted `code` will determine the standard message (unless the `message` option is defined).

<a id="new_ConnectionError_new"></a>
##### `new ConnectionError([options], defaults)` 

Constructor for the [`ConnectionError`](#ConnectionError) class.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.issue`] | `string` | _variaus_ | Typically left `undefined` and determined automatically according to   the error `code`. Describes the specific issue. |
| [`options.target`] | `string` \| `undefined` |  | The name or description of the connection target. |

**Example**:
```js
new ConnectionError() // "Connection has experienced an unknown error."
// v "Connection to host 'foo.com' has experienced an unknown error."
new ConnectionError({ target: "to host 'foo.com'" })
// v "Connection to host 'foo.com' is blocked by system firewall."
new ConnectionError({ target: "to host 'foo.com'", issue: 'is blocked by system firewall' })
new ConnectionError({ code: 'ECONNRESET' }) // "Connection has been reset."
const cause = new Error()
const cause.code = 'ECONNRESET'
const connError = new ConnectionError({ cause }) // also "Connection has been reset."
```

<a id="ConstraintViolationError"></a>
#### `ConstraintViolationError` <sup>↱[source code](./src/constraint-violation-error.mjs#L19)</sup> <sup>⇧[global class index](#global-class-index)</sup>

Indicates the requested operation is well formed and the data otherwise correct, but it violates a data constraint.
`ConstraintViolationError` is distinguished from [`ArgumentInvalidError`](#ArgumentInvalidError) in that argument errors are evaluated
at the function level, while constraint violations result from database constraints.

<a id="new_ConstraintViolationError_new"></a>
##### `new ConstraintViolationError([options], defaults)` 

[`ConstraintViolationError`](#ConstraintViolationError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.constraintType`] | `string` | &#x27;constraint&#x27; | The constraint type. |
| [`options.entityType`] | `string` \| `undefined` |  | The "type" of entity. E.g., 'user'. |
| [`options.fieldAndValues`] | `Array.<string>` \| `Array.<Array.string>` | `[]` | An array of either field names and/or   arrays of field name + field value. You may mix and match, e.g., `['field1', ['field2', 'value2']`. |

**Example**:
```js
new ConstraintViolationError() // "Constraint violated."
new ConstraintViolationError({ constraintType: 'foreign key' }) // "Foreign key constraint violated."
new ConstraintViolationError({ entityType : 'user' }) // "Constraint on entity type 'user' violated."
// v "Enumeration constraint on fields <email> on entity type 'user' violated."
new ConstraintViolationError({ constraintType : 'enumeration', entityType : 'user', fieldAndValues : ['email'] })
// v "Constraint on fields <email(john@foo.com)> on entity type 'user' violated."
new ConstraintViolationError({ entityType : 'user', fieldAndValues : [['email', 'john@foo.com']] })
```

<a id="DatabaseError"></a>
#### `DatabaseError` <sup>↱[source code](./src/database-error.mjs#L17)</sup> <sup>⇧[global class index](#global-class-index)</sup>

Indicates a problem within a database system implementation.
Consider whether any of the following errors might be more precise or better suited:
- [`RollbackError`](#RollbackError)
- [`TransactionError`](#TransactionError)

<a id="new_DatabaseError_new"></a>
##### `new DatabaseError([options], defaults)` 

[`DatabaseError`](#DatabaseError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.action`] | `string` \| `undefined` |  | A description of the action being taken. E.g., 'closing',   'creating', etc. |
| [`options.errorType`] | `string` | &#x27;an error&#x27; | A description of the error type. |
| [`options.issue`] | `string` \| `undefined` |  | Describes the specific issue. |
| [`options.target`] | `string` | &#x27;target&#x27; | The name or description of the target resource. |

**Example**:
```js
new DatabaseError() // "There an error in the database."
new DatabaseError({ action : 'syncing' }) // "There was an error syncing the database."
new DatabaseError({ target : 'customer database' }) // "There was an error in the customer database."
// v "There was an error creating the customer database."
new DatabaseError({ action: 'creating', target : 'customer database' })
// v "There was an error in the customer database; virtual socket closed."
new DatabaseError({ issue : 'virtual socket closed', target : 'customer database' })
```

<a id="DataServiceError"></a>
#### `DataServiceError` <sup>↱[source code](./src/data-service-error.mjs#L20)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem related to a data service specifically.

Consider whether any of the following errors might be more precise or better suited:
- [`ConnectionError`](#ConnectionError)
- [`ConstraintViolationError`](#ConstraintViolationError)
- [`RollbackError`](#RollbackError)
- [`TransactionError`](#TransactionError)
- [`UniqueConstraintViolationError`](#UniqueConstraintViolationError)

<a id="new_DataServiceError_new"></a>
##### `new DataServiceError([options], defaults)` 

[`DataServiceError`](#DataServiceError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.service`] | `string` | &#x27;data&#x27; | The name or short description of the service. |
| [`options.issue`] | `string` \| `undefined` |  | A description of the issue. |

**Example**:
```js
new DataServiceError() // There was an error with a remote data service.
new DataServiceError({ service : 'database' }) // The was an error with the remote database service.
// v "There was an error with a remote data service; service is not rot responding."
new DataServiceError({ issue : 'is not responding' })
// v "There was an error with the remote database service; service is not responding."
new DataServiceError({ service : 'database', issue : 'is not responding' })
```

<a id="DirectoryNotFoundError"></a>
#### `DirectoryNotFoundError` <sup>↱[source code](./src/directory-not-found-error.mjs#L20)</sup> <sup>⇧[global class index](#global-class-index)</sup>

A [`NotFoundError`](#NotFoundError) sub-type indicating there is no file at the requested location. If both `dirPath` and
`fileName` are specified, `DirectoryNotFound` tries to be smart about joining them and will try and guess the proper
path separator and whether it needs to be appended or not.

Consider whether any of the following errors might be more precise or better suited:
- [`FileNotFoundError`](#FileNotFoundError)
- [`NotFoundError`](#NotFoundError)

<a id="new_DirectoryNotFoundError_new"></a>
##### `new DirectoryNotFoundError([options], defaults)` 

[`DirectoryNotFoundError`](#DirectoryNotFoundError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.dirPath`] | `string` \| `undefined` |  | The directory (not including the file itself) where the   file is located. |
| [`options.resource`] | `string` \| `undefined` |  | Should usually be left undefined. If set, then the   value will override `dirPath` and be used to generate the standard message if `message` option not set. |

**Example**:
```js
new DirectoryNotFound() // "Directory not found."
new DirectoryNotFound({ dirPath: '/my-dir' }) // "Directory '/my-dir' not found."
```

<a id="EndOfStreamError"></a>
#### `EndOfStreamError` <sup>↱[source code](./src/end-of-stream-error.mjs#L18)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`IoError`](#IoError) sub-type indicating an attempt to read beyond the of a stream.

Consider whether any of the following errors might be more precise or better suited:
- [`EndOfStreamError`](#EndOfStreamError)
- [`IoError`](#IoError)

<a id="new_EndOfStreamError_new"></a>
##### `new EndOfStreamError([options], defaults)` 

[`EndOfStreamError`](#EndOfStreamError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.action`] | `string` | &#x27;reading&#x27; | A description of the action being taken; default to 'reading'. |
| [`options.issue`] | `string` \| `undefined` |  | Describes the specific issue. |
| [`options.target`] | `string` \| `undefined` |  | The name or description of the target resource. |

**Example**:
```js
new EndOfStreamError() // "There was an end-of-stream error."
new EndOfStreamError({ action : 'streaming' }) // "There was an end-of-stream error streaming."
new EndOfStreamError({ target : 'serial port' }) // "There was an end-of-stream error reading the serial port."
// v "There was an end-of-stream error streaming the serial port."
new EndOfStreamError({ action: 'streaming', target : 'serial port' })
// v "There was an end-of-stream error reading the serial port; virtual socket closed."
new EndOfStreamError({ issue : 'virtual socket closed', target : 'serial port' })
```

<a id="ExternalServiceError"></a>
#### `ExternalServiceError` <sup>↱[source code](./src/external-service-error.mjs#L20)</sup> <sup>⇧[global class index](#global-class-index)</sup>

Indicates an error related to an external service.

Consider whether any of the following errors might be more precise or better suited:
- [`ConstraintViolationError`](#ConstraintViolationError)
- [`DataServiceError`](#DataServiceError)
- [`RollbackError`](#RollbackError)
- [`TransactionError`](#TransactionError)
- [`UniqueConstraintViolationError`](#UniqueConstraintViolationError)

<a id="new_ExternalServiceError_new"></a>
##### `new ExternalServiceError([options], defaults)` 

[`ExternalServiceError`](#ExternalServiceError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.service`] | `string` | &#x27;&#x27; | The name or short description of the service. |
| [`options.issue`] | `string` \| `undefined` |  | A description of the issue. |

**Example**:
```js
new ExternalServiceError() // There was an error with a remote service.
new ExternalServiceError({ service : 'Foo API' }) // The was an error with the Foo API remote service.
// v "A remote service is not responding."
new ExternalServiceError({ issue : 'is not responding' })
// v "The remote service Foo API is not responding."
new ExternalServiceError({ service : 'Foo API', issue : 'is not responding' })
```

<a id="FileLoadError"></a>
#### `FileLoadError` <sup>↱[source code](./src/file-load-error.mjs#L19)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`IoError`](#IoError) indicating a file is present, and can be read, but there is a problem loading it.

Consider whether any of the following errors might be more precise or better suited:
- [`IoError`](#IoError)
- [`FileLoadError`](#FileLoadError)

<a id="new_FileLoadError_new"></a>
##### `new FileLoadError([options], defaults)` 

[`FileLoadError`](#FileLoadError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.action`] | `string` | &#x27;loading&#x27; | A description of the action being taken. Default to 'loading'. |
| [`options.dirPath`] | `string` \| `undefined` |  | The directory (not including the file itself) where the   file is located. |
| [`options.fileName`] | `string` \| `undefined` |  | The name of the file itself. May be a full path (in   which case `dirPath` should be left undefined) or just the file name, in which case it is combined with   `dirPath`, if present, to create the standard error message. |
| [`options.issue`] | `string` \| `undefined` |  | Describes the specific issue. |
| [`options.target`] | `string` \| `undefined` |  | The name or description of the target resource. Should   generally be left in preference for setting `fileName` and/or `filePath`. |

**Example**:
```js
new FileLoadError() // "There was an error loading the file."
new FileLoadError({ action : 'reading' }) // "There was an error reading the file."
new FileLoadError({ fileName : 'foo.txt' }) // "There an error loading the file 'foo.txt'."
new FileLoadError({ dirPath : '/bar', fileName: 'foo.txt' }) // "There an error loading the file '/bar/foo.txt'."
// v "There an error loading the file in directory '/bar'; virtual socket closed."
new FileLoadError({ issue : 'virtual socket closed', dirPath : '/bar' })
```

<a id="FileNotFoundError"></a>
#### `FileNotFoundError` <sup>↱[source code](./src/file-not-found-error.mjs#L20)</sup> <sup>⇧[global class index](#global-class-index)</sup>

A [`NotFoundError`](#NotFoundError) sub-type indicating there is no file at the requested location. If both `dirPath` and
`fileName` are specified, `FileNotFound` tries to be smart about joining them and will try and guess the proper path
separator and whether it needs to be appended or not.

Consider whether any of the following errors might be more precise or better suited:
- [`DirectoryNotFoundError`](#DirectoryNotFoundError)
- [`NotFoundError`](#NotFoundError)

<a id="new_FileNotFoundError_new"></a>
##### `new FileNotFoundError([options], defaults)` 

[`FileNotFoundError`](#FileNotFoundError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.dirPath`] | `string` \| `undefined` |  | The directory (not including the file itself) where the   file is located. |
| [`options.fileName`] | `string` \| `undefined` |  | The name of the file itself. May be a full path (in   which case `dirPath` should be left undefined) or just the file name, in which case it is combined with   `dirPath`, if present, to create the standard error message. |
| [`options.resource`] | `string` \| `undefined` |  | Should usually be left undefined. If set, then the   value will override `fileName` and `dirPath` and be used to generate the standard message if `message` option   not set. |

**Example**:
```js
new FileNotFound() // "File not found."
new FileNotFound({ fileName: 'foo.txt' }) // "File 'foo.txt' not found."
new FileNotFound({ dirPath: '/tmp', fileName: 'foo.txt'}) // "File '/tmp/foo.txt' not found."
new FileNotFound({ dirPath: '/tmp/', fileName: 'foo.txt'}) // "File '/tmp/foo.txt' not found."
new FileNotFound({ dirPath: '/this-is-weird' }) // "File in directory '/this-is-weird' not found."
```

<a id="IoError"></a>
#### `IoError` <sup>↱[source code](./src/io-error.mjs#L19)</sup> <sup>⇧[global class index](#global-class-index)</sup>

A generic local I/O error _not_ involving a missing resource. Note that `IoError`s are specifically locally and
external service, or remote connections errors are therefore not I/O errors.

Consider whether any of the following errors might be more precise or better suited:
- [`EndOfStreamError`](#EndOfStreamError)
- [`FileLoadError`](#FileLoadError)

<a id="new_IoError_new"></a>
##### `new IoError([options], defaults)` 

[`IoError`](#IoError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.action`] | `string` \| `undefined` |  | A description of the action being taken. E.g., 'reading'   or 'writing'. Defaults to 'accessing'. |
| [`options.issue`] | `string` \| `undefined` |  | Describes the specific issue. |
| [`options.target`] | `string` \| `undefined` |  | The name or description of the target resource. |

**Example**:
```js
new IoError() // "There was an IO error."
new IoError({ action : 'reading' }) // "There was an IO error while reading."
new IoError({ target : 'serial port' }) // "There an IO error while accessing the serial port."
new IoError({ action: 'reading', target : 'serial port' }) // "There an IO error while reading the serial port."
// v "There an IO error while accessing the serial port; virtual socket closed."
new IoError({ issue : 'virtual socket closed', target : 'serial port' })
```

<a id="LocalRollbackError"></a>
#### `LocalRollbackError` <sup>↱[source code](./src/local-rollback-error.mjs#L13)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`DatabaseError`](#DatabaseError) sub-type relating to a failed rollback within a database. Use [`RollbackError`](#RollbackError) on the
client side to indicate a failed rollback in an external data service.

<a id="new_LocalRollbackError_new"></a>
##### `new LocalRollbackError([options], defaults)` 

[`LocalRollbackError`](#LocalRollbackError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.action`] | `string` \| `undefined` |  | A description of the action being taken. E.g., 'closing',   'creating', etc. |
| [`options.errorType`] | `string` | &#x27;a rollback error&#x27; | A description of the error type. |
| [`options.issue`] | `string` \| `undefined` |  | Describes the specific issue. |
| [`options.target`] | `string` | &#x27;database&#x27; | The name or description of the target resource. |

**Example**:
```js
new LocalRollbackError() // "There an error in the database."
new LocalRollbackError({ action : 'updating' }) // "There was a rollback error updating the database."
new LocalRollbackError({ target : 'customer database' }) // "There was a rollback error in the customer database."
// v "There was a rollback error updating the customer database."
new LocalRollbackError({ action: 'updating', target : 'customer database' })
// v "There was a rollback error in the customer database; virtual socket closed."
new LocalRollbackError({ issue : 'virtual socket closed', target : 'customer database' })
```

<a id="LocalTransactionError"></a>
#### `LocalTransactionError` <sup>↱[source code](./src/local-transaction-error.mjs#L13)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`DatabaseError`](#DatabaseError) indicating a problem creating or otherwise involving a transaction within a database system
itself. Use [`TransactionError`](#TransactionError) for transaction errors related to transactions in an external database service.

<a id="new_LocalTransactionError_new"></a>
##### `new LocalTransactionError([options], defaults)` 

[`LocalTransactionError`](#LocalTransactionError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.action`] | `string` \| `undefined` |  | A description of the action being taken. E.g., 'closing',   'creating', etc. |
| [`options.errorType`] | `string` | &#x27;an error&#x27; | A description of the error type. |
| [`options.issue`] | `string` \| `undefined` |  | Describes the specific issue. |
| [`options.target`] | `string` | &#x27;database&#x27; | The name or description of the target resource. |

**Example**:
```js
new LocalTransactionError() // "There was a transaction error."
new LocalTransactionError({ action : 'closing' }) // "There was an error closing the transaction."
// v "There was a transaction error on the customer database."
new LocalTransactionError({ target : 'customer database' })
// v "There was an error closing the transaction on the customer database."
new LocalTransactionError({ action: 'creating', target : 'customer database' })
// v "There was a transaction error on the customer database; virtual socket closed."
new LocalTransactionError({ issue : 'virtual socket closed', target : 'customer database' })
```

<a id="NoAccessDirectoryError"></a>
#### `NoAccessDirectoryError` <sup>↱[source code](./src/no-access-directory-error.mjs#L24)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`NoAccessError`](#NoAccessError) indicating a user lacks the rights to access a particular directory. Note, in high security
systems, it is often desirable to tell the user a resource was 'not found', even when the problem is really an
access issue, use and see [`maskNoAccessErrors`](#maskNoAccessErrors) to deal with this situation.

Consider whether any of the following errors might be more precise or better suited:
- [`AuthenticationRequiredError`](#AuthenticationRequiredError) - Use this when the resource requires authenticated access and the user is not
  currently authenticated.
- [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError) - Use this when the user is authorized to access the directory under
  some conditions.
- [`NoAccessError`](#NoAccessError)
- [`NoAccessFileError`](#NoAccessFileError)
- [`OperationNotPermittedError`](#OperationNotPermittedError)

<a id="new_NoAccessDirectoryError_new"></a>
##### `new NoAccessDirectoryError([options], defaults)` 

[`NoAccessDirectoryError`](#NoAccessDirectoryError) constructor. Refer to [`DirectoryNotFoundError`](#DirectoryNotFoundError) for additional examples of
constructed messages when a 404 status is set or mapped to this error type.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.dirPath`] | `string` \| `undefined` |  | The directory (not including the file itself) where the   file is located. |
| [`options.resource`] | `string` \| `undefined` |  | Should usually be left undefined. If set, then the   value will override `dirPath` and be used to generate the standard message if `message` option not set.} |

**Example**:
```js
new NoAccessDirectoryError() // "Access to directory is denied."
new NoAccessDirectoryError() // when access errors mapped to 404: "Directory not found."
new NoAccessDirectoryError({ dirPath = '/foo' }) // "Access to director '/foo' is denied"
```

<a id="NoAccessError"></a>
#### `NoAccessError` <sup>↱[source code](./src/no-access-error.mjs#L29)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`AuthError`](#AuthError) indicating a user lacks the rights to access a particular resource. This error is most
appropriate when trying to read or write something. If the user is attempting to perform an operation, consider the
[`OperationNotPermittedError`](#OperationNotPermittedError). Note, in high security systems, it is often desirable to tell the user a 
resource was 'not found', even when the problem is really an access issue, use and see [`maskNoAccessErrors`](#maskNoAccessErrors) to 
deal with this situation.

Consider whether any of the following errors might be more precise or better suited:
- [`AuthenticationRequiredError`](#AuthenticationRequiredError) - Use this when the resource requires authenticated access and the user is not
  currently authenticated.
- [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError) - Use this when the user is authorized to access the resource under
  some conditions.
- [`NoAccessDirectoryError`](#NoAccessDirectoryError)
- [`NoAccessFileError`](#NoAccessFileError)
- [`OperationNotPermittedError`](#OperationNotPermittedError)

<a id="new_NoAccessError_new"></a>
##### `new NoAccessError([options], defaults)` 

[`NoAccessError`](#NoAccessError) constructor. Refer to [`NotFoundError`](#NotFoundError) for additional examples of constructed messages
when a 404 status is set or mapped to this error type.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.resource`] | `string` \| `undefined` |  | A description of the resource attempting to be accessed. |
| [`options.status`] | `number` | `(404 | 409)` | The HTTP status of the error. Should generally be left undefined   so as to be automatically determined according to [@link mapErrorToHttpStatus | configured error mapping]. |

**Example**:
```js
new NoAccessError() // "Access to resource is denied."
new NoAccessError() // when mapped to 404 status: "Resource is not found."
new NoAccessError({ resource : 'terminal connection' }) // Access to terminal connection is denied.
```

<a id="NoAccessFileError"></a>
#### `NoAccessFileError` <sup>↱[source code](./src/no-access-file-error.mjs#L24)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`NoAccessError`](#NoAccessError) indicating a user lacks the rights to access a particular file. Note, in high security
systems, it is often desirable to tell the user a resource was 'not found', even when the problem is really an
access issue, use and see [`maskNoAccessErrors`](#maskNoAccessErrors) to deal with this situation.

Consider whether any of the following errors might be more precise or better suited:
- [`AuthenticationRequiredError`](#AuthenticationRequiredError) - Use this when the resource requires authenticated access and the user is not
  currently authenticated.
- [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError) - Use this when the user is authorized to access the file under some
  conditions.
- [`NoAccessDirectoryError`](#NoAccessDirectoryError)
- [`NoAccessError`](#NoAccessError)
- [`OperationNotPermittedError`](#OperationNotPermittedError)

<a id="new_NoAccessFileError_new"></a>
##### `new NoAccessFileError([options], defaults)` 

[`NoAccessFileError`](#NoAccessFileError) constructor. Refer to [`FileNotFoundError`](#FileNotFoundError) for additional examples of constructed
messages when a 404 status is set or mapped to this error type.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.dirPath`] | `string` \| `undefined` |  | The directory (not including the file itself) where the   file is located. If defined, and the `resource` option is undefined, then `dirPath` is combined with `fileName`,   if present, to define the `resource`. This option cannot be suppressed directly, but the `resource` can be. |
| [`options.fileName`] | `string` \| `undefined` |  | The name of the file itself. May be a full path (in   which case `dirPath` should be left undefined) or just the file name. If defined, and the `resource` option is   undefined, then `fileName` is combined with `dirPath`, if present, to define the `resource`. This option cannot   be suppressed directly, but the `resource` can be. |
| [`options.resource`] | `string` \| `undefined` |  | Should usually be left undefined. If set, then the   value will override `fileName` and `dirPath` and be used to generate the standard message if `message` option   not set. |

**Example**:
```js
new NoAccessFileError() // "Access to file is denied."
new NoAccessFileError() // when status is 404: "File not found."
new NoAccessFileError({ fileName: 'bar' }) // Access to file 'bar' is denied.
new NoAccessFileError({ dirPath: '/foo', fileName: 'bar' }) // Access to file '/foo/bar' is denied.
new NoAccessFileError({ dirPath: '/foo' }) // Access to file in directory '/foo' is denied.
```

<a id="NotFoundError"></a>
#### `NotFoundError` <sup>↱[source code](./src/not-found-error.mjs#L21)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An error indicating a resource or entity cannot be found. This error is used with local and remote resources/entities
where the fundamental issue is the named thing not being present.

Consider whether any of the following errors might be more precise or better suited:
- [`DirectoryNotFoundError`](#DirectoryNotFoundError)
- [`FileNotFoundError`](#FileNotFoundError)
- [`NoAccessError`](#NoAccessError) and sub-classes where the issue is related to resource authorizations.
- [`OperationNotPermittedError`](#OperationNotPermittedError) where the issue is related to action authorizations (as opposed to resource
  authorizations)

<a id="new_NotFoundError_new"></a>
##### `new NotFoundError([options], defaults)` 

[`NotFoundError`](#NotFoundError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.resource`] | `string` \| `undefined` |  | The name or short description of the missing resource. |
| [`options.code`] | `string` | &#x27;ENOENT&#x27; | The code to use with the error. Should generally be left to the   default. |

**Example**:
```js
new NotFoundError() // "Resource not found."
new NotFoundError({ resource : 'the hidden garden' }) // "The hidden garden is not found."
```

<a id="NotImplementedError"></a>
#### `NotImplementedError` <sup>↱[source code](./src/not-implemented-error.mjs#L16)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An error indicating the requested operation is not currently implemented.

Consider whether any of the following errors might be more precise or better suited:
- [`NotSupportedError`](#NotSupportedError) - Use this when the target is implemented, but does not support some feature or
  condition captured in the request.
- [`UnavailableError`](#UnavailableError) - Use this when a resource exists, but is temporarily unavailable for some reason.

<a id="new_NotImplementedError_new"></a>
##### `new NotImplementedError([options])` 

[`NotImplementedError`](#NotImplementedError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.target`] | `string` \| `undefined` |  | The name of the function, endpoint, service, etc. which   the user is trying to invoke. |

**Example**:
```js
new NotImplementedError() // "Action not currently implemented."
new NotImplementedError({ target: '/some/url/endpoint'}) // "'/some/url/endpoint' is not currently implemented."
```

<a id="NotSupportedError"></a>
#### `NotSupportedError` <sup>↱[source code](./src/not-supported-error.mjs#L20)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An error indicating that the resource exists, but does not support some aspect of the request as is. This is most
typically used when implementing a specification, but where some feature of the specification is not implemented.
E.g., let's say a specification says requests can use JSON or YAML, but we only implement JSON support. If we get a
request with a YAML payload, we could throw a `NotSUpportedError`.

Consider whether any of the following errors might be more precise or better suited:
- [`NotImplementedError`](#NotImplementedError) - Use this when the target is not implemented at all.
- [`UnavailableError`](#UnavailableError) - Use this when the target is implemented, but temporarily unavailable for some reason.

<a id="new_NotSupportedError_new"></a>
##### `new NotSupportedError([options], defaults)` 

[`NotSupportedError`](#NotSupportedError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.missingFeature`] | `string` \| `undefined` | &#x27;a requested feature&#x27; | A short description of the action or   thing which is not supported. E.g., 'YAML request payloads' or 'asynchronous execution'. |
| [`options.hint`] | `string` \| `undefined` |  | A short hint to the user as to how they might resolve or   workaround the issue. This should be a complete sentence. E.g., 'Encode request in JSON.' or 'Try synchronous   execution.' |
| [`options.target`] | `string` \| `undefined` |  | The name of the function, endpoint, service, etc. which   the user is trying to invoke. E.g., '/some/url/endpoint' or 'myFunction()' |

**Example**:
```js
new NotSupportedError() // "The target does not currently support a requested feature."
// v "'/some/endpoint' does not currently support a requested feature."
new NotSupportedError({ target: '/some/endpoint'})
// v "'myFunc()' does not currently support RFC 3339 style dates."
new NotSupportedError({ target: 'myFunc()', issue: 'RFC 3339 style dates' })
// v "The target does not currently support YAML payloads. Send request in JSON."
new NotSupportedError({ issue: 'YAML payloads', hint : 'Send request in JSON.' })
```

<a id="OperationNotPermittedError"></a>
#### `OperationNotPermittedError` <sup>↱[source code](./src/operation-not-permitted-error.mjs#L21)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An [`AuthError`](#AuthError) indicating the user lacks authorization to perform some operation. This is most appropriate
when the user is trying to _do_ something. If the user is attempting to "access" a resource, the [`NoAccessError`](#NoAccessError) or it's children may be better suited. Consider whether any of the following errors might be more
precise or better suited:
- [`AuthenticationRequiredError`](#AuthenticationRequiredError)
- [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError) - Use this when the user is authorized to perform the operation under
  some conditions.
- [`BadCredentialsError`](BadCredentialsError)
- [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError)
- [`NoAccessError`](#NoAccessError)

<a id="new_OperationNotPermittedError_new"></a>
##### `new OperationNotPermittedError([options], defaults)` 

[`OperationNotPermittedError`](#OperationNotPermittedError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.action`] | `string` | &#x27;action&#x27; | A short description of the action. |
| [`options.target`] | `string` \| `undefined` |  | The name or short description of the target. |
| [`options.issue`] | `string` | &#x27;is not permitted&#x27; | The auth issue. |

**Example**:
```js
new OperationNotPermittedError() // "Action is not permitted."
new OperationNotPermittedError({ action = 'database update' }) // "Database update is not permitted."
// v "Accessing the customer database is not permitted."
new OperationNotPermittedError({ target = 'customer database' })
// v "Updating the customer database is not permitted."
new OperationNotPermittedError({ action = 'updating', target = 'customer database '})
new OperationNotPermittedError({ issue = 'is not authorized' }) // Action is not authorized.
```

<a id="RollbackError"></a>
#### `RollbackError` <sup>↱[source code](./src/rollback-error.mjs#L22)</sup> <sup>⇧[global class index](#global-class-index)</sup>

A [`DataServiceError`](#DataServiceError) relating to a failed rollback attempt on an external data service. Use [`LocalRollbackError`](#LocalRollbackError) within a database implementation itself.

Consider whether any of the following errors might be more precise or better suited:
- [`ConnectionError`](#ConnectionError)
- [`ConstraintViolationError`](#ConstraintViolationError)
- [`DataServiceError`](#DataServiceError)
- [`LocalRollbackError`](#LocalRollbackError)
- [`TransactionError`](#TransactionError)
- [`UniqueConstraintViolationError`](#UniqueConstraintViolationError)

<a id="new_RollbackError_new"></a>
##### `new RollbackError([options], defaults)` 

[`RollbackError`](#RollbackError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.service`] | `string` | &#x27;data&#x27; | The name or short description of the service. |
| [`options.issue`] | `string` \| `undefined` |  | A description of the issue. |

**Example**:
```js
new RollbackError() // There was a rollback error with the remote data service.
new RollbackError({ service : 'database' }) // There was a rollback error with the remote database service.
// v "There was a rollback error with the remote data service; service is not responding."
new RollbackError({ issue : 'is not responding' })
// v "There was a rollback error with the database remote data service; service is not rot responding."
new RollbackError({ service : 'database', issue : 'is not responding' })
```

<a id="SystemError"></a>
#### `SystemError` <sup>↱[source code](./src/system-error.mjs#L13)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An error indicating a system error. When used to wrap native system errors (like `ReferenceError`, `SyntaxError`, etc.), be sure to set the `cause` option.

<a id="new_SystemError_new"></a>
##### `new SystemError([options], defaults)` 

[`SystemError`](#SystemError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


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
#### `TimeoutError` <sup>↱[source code](./src/timeout-error.mjs#L12)</sup> <sup>⇧[global class index](#global-class-index)</sup>

Indicates an operation is taking too much time.

<a id="new_TimeoutError_new"></a>
##### `new TimeoutError([options], defaults)` 

[`TimeoutError`](#TimeoutError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.resource`] | `string` \| `undefined` |  | The name or short description of the thing which is   timing out. |

**Example**:
```js
// new TimeoutError() // "The process has timed out."
// new TimeoutError({ resource : 'user session' }) // "The user session has timed out."
```

<a id="TransactionError"></a>
#### `TransactionError` <sup>↱[source code](./src/transaction-error.mjs#L22)</sup> <sup>⇧[global class index](#global-class-index)</sup>

A [`DataServiceError`](#DataServiceError) sub-type indicating a problem with creating or working with a transaction. Note, this
error is specifically for problems arising with an external data service; use [`LocalTransactionError`](#LocalTransactionError) for
error or otherwise involving a transaction within a database system itself.

Consider whether any of the following errors might be more precise or better suited:
- [`ConnectionError`](#ConnectionError)
- [`ConstraintViolationError`](#ConstraintViolationError)
- [`DataServiceError`](#DataServiceError)
- [`RollbackError`](#RollbackError)
- [`UniqueConstraintViolationError`](#UniqueConstraintViolationError)

<a id="new_TransactionError_new"></a>
##### `new TransactionError([options], defaults)` 

[`TransactionError`](#TransactionError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.service`] | `string` \| `undefined` |  | The name or short description of the service. |
| [`options.issue`] | `string` \| `undefined` |  | A description of the issue. |

**Example**:
```js
new TransactionError() // There was a transaction error with the remote data service.
new TransactionError({ service : 'database' }) // There was a transaction error with the remote database service.
// v "There was a transaction error with the remote data service; service is not responding."
new TransactionError({ issue : 'is not responding' })
// v "There was a transaction error with the remote database service; service is not responding."
new TransactionError({ service : 'database', issue : 'is not responding' })
```

<a id="UnavailableError"></a>
#### `UnavailableError` <sup>↱[source code](./src/unavailable-error.mjs#L18)</sup> <sup>⇧[global class index](#global-class-index)</sup>

An error indicating that the resource exists, but is not currently available. This represents a temporary condition.

Consider whether any of the following errors might be more precise or better suited:
- [`NotImplementedError`](#NotImplementedError) - Use this when the target is not implemented at all.
- [`NotSupportedError`](#NotSupportedError) - Use this when the target is implemented, but doesn't support some requested feature.

<a id="new_UnavailableError_new"></a>
##### `new UnavailableError([options], defaults)` 

[`UnavailableError`](#UnavailableError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | The constructor options. |
| [`options.expectedTime`] | `string` \| `undefined` |  | A short description as to when the resource might be   available. E.g., 'after 1400' or 'in two hours'. |
| [`options.issue`] | `string` | &#x27;currently unavailable&#x27; | - |
| [`options.target`] | `string` | &#x27;target resource&#x27; | The name of the function, endpoint, service, etc. which the   user is trying to invoke. E.g., '/some/url/endpoint' or 'myFunction()' |

**Example**:
```js
new UnavailableError() // "The target resource is currently unavailable.
new UnavailableError({ target: 'URL /some/endpoint'}) // "The URL /some/endpoint is not currently available."
// v "The customer DB is offline for maintenance."
new UnavailableError({ target: 'customer DB', issue: 'offline for maintenance' })
// v "The URL /some/endpoint is not currently available; try again after 12:00 Saturday.'
new UnavailableError({ target: 'URL /some/endpoint', expectedTime: 'after 12:00 Saturday' })
```

<a id="UniqueConstraintViolationError"></a>
#### `UniqueConstraintViolationError` <sup>↱[source code](./src/unique-constraint-violation-error.mjs#L12)</sup> <sup>⇧[global class index](#global-class-index)</sup>

A [`ConstraintViolationError`](#ConstraintViolationError) sub-type indicating violation of a unique constraint, such as login ID.

<a id="new_UniqueConstraintViolationError_new"></a>
##### `new UniqueConstraintViolationError([options], defaults)` 

[`UniqueConstraintViolationError`](#UniqueConstraintViolationError) constructor.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`options`] | `object` | `{}` | Constructor options. |
| [`options.constraintType`] | `string` | &#x27;unique constraint&#x27; | The constraint type. |
| [`options.entityType`] | `string` \| `undefined` |  | The "type" of entity (e.g., 'user'; optional). |
| [`options.fieldAndValues`] | `Array.<string>` \| `Array.<Array.string>` | `[]` | An array of either field names and/or   arrays of field name + field value (optional). You may mix and match, e.g., `['field1', ['field2', 'value2']`. |

**Example**:
```js
new UniqueConstraintViolationError() // "Unique constraint violated."
new UniqueConstraintViolationError({ entityType : 'user' }) // "Unique constraint on entity type 'user' violated."
// v "Unique constraint on fields <email>."
new UniqueConstraintViolationError({ entityType : 'user', fieldAndValues : ['email'] })
// v "Unique constraint on fields <email(john@foo.com)> on entity type 'user' violated."
new UniqueConstraintViolationError({ entityType : 'user', fieldAndValues : [['email', 'john@foo.com']] })
```

<a id="commonErrorSettings"></a>
#### `commonErrorSettings(option, value)` ⇒ `*` <sup>↱[source code](./src/common-error-settings.mjs#L30)</sup> <sup>⇧[global function index](#global-function-index)</sup>

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

<a id="mapErrorToHttpStatus"></a>
#### `mapErrorToHttpStatus(errorRef, status)` ⇒ `number` \| `undefined` <sup>↱[source code](./src/map-error-to-http-status.mjs#L32)</sup> <sup>⇧[global function index](#global-function-index)</sup>

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

<a id="mapHttpStatusToName"></a>
#### `mapHttpStatusToName(status, name)` ⇒ `string` \| `undefined` <sup>↱[source code](./src/map-http-status-to-name.mjs#L66)</sup> <sup>⇧[global function index](#global-function-index)</sup>

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

<a id="maskNoAccessErrors"></a>
#### `maskNoAccessErrors()` <sup>↱[source code](./src/mask-no-access-errors.mjs#L16)</sup> <sup>⇧[global function index](#global-function-index)</sup>

Remaps [`NoAccessError`](#NoAccessError)s (and all children) to a 404 (Not Found) status and changes the generated message. This
will effectively remap and custom mappings of [`NoAccessError`](#NoAccessError) or it's children that may be in place. This  is a
common practice in secure systems where it is undesirable to give attackers any information about a resource they
don't have access to. I.e., if a user tries to access a resource they are not permitted to access, an unmasked [`NoAccessError`](#NoAccessError) would divulge the existence of a resource. Note, this does not change the class of the error itself,
so and developers _should_ continue to use [`NoAccessError`](#NoAccessError)s where the problem is actually access. In
production systems, the [presentation of errors to the users](#presenting-errors-to-users) should not indicate the
underlying type.

<a id="rethrowIf"></a>
#### `rethrowIf([error], [testOptions])` ⇒ `Error` \| `undefined` <sup>↱[source code](./src/rethrow-if.mjs#L28)</sup> <sup>⇧[global function index](#global-function-index)</sup>

One liner to test and re-throw errors if any conditions are met.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [`error`] | `Error` \| `undefined` |  | The `Error` to test against and possibly re-throw. |
| [`testOptions`] | `object` | `{}` | The set of conditions to test against. If any of the conditions test true, then   the error` is re-thrown. |
| [`testOptions.codeIs`] | `string` \| `Array.<string>` \| `undefined` |  | Throws if `error.code` is _any_ of the   listed codes. |
| [`testOptions.codeIsNot`] | `string` \| `Array.<string>` \| `undefined` |  | Throws if `error.code` is _not any_ of   the listed codes. |
| [`testOptions.instanceOf`] | `function` \| `Array.<function()>` \| `undefined` |  | Throws if `error` is an   instance of _any_ of the listed classes. |
| [`testOptions.instanceOfNot`] | `function` \| `Array.<function()>` \| `undefined` |  | Throws if `error` is not   an instance of _any_ of the listed classes. |
| [`testOptions.statusGt`] | `number` \| `undefined` |  | Throws if `error.status` is defined and status is   _greater than_ the specified status. |
| [`testOptions.statusGte`] | `number` \| `undefined` |  | Throws if `error.status` is defined and status is   _greater than or equal_ to the  specified status. |
| [`testOptions.statusLt`] | `number` \| `undefined` |  | Throws if `error.status` is defined and status is   _less than_ the specified status. |
| [`testOptions.statusLte`] | `number` \| `undefined` |  | Throws if `error.status` is defined and status is   _less than or equal_ to the  specified status. |
| [`testOptions.statusIs`] | `number` \| `Array.<number>` \| `undefined` |  | Throws if `error.status` is defined and   _any_ of the specified statuses. |
| [`testOptions.statusIsNot`] | `number` \| `Array.<number>` \| `undefined` |  | Throws if `error.status` is defined   and _not any_ of the specified statuses. |

**Returns**: `Error` \| `undefined` - - If the function does not throw, it returns the `error`.

<a id="wrapError"></a>
#### `wrapError(error, options)` ⇒ `Array.<Error, boolean>` <sup>↱[source code](./src/wrap-error.mjs#L47)</sup> <sup>⇧[global function index](#global-function-index)</sup>

Wraps an `Error` in a [`CommonError`](#CommonError). The `error` parameter will be set as the `cause` field of the new
`CommonError` instance (unless `cause` is specifically set in the `options`).

The wrapping logic is as follows:
- If the `noInstanceHidingOnWrap` is `true` and the `error` class is anything but `Error`
  (`error.name !== 'Error'`), then results in the original error.
- If the `error` `code` indicates a connection error, results in a [`ConnectionError`](#ConnectionError).
- If the `error` `code` is 'EACCESS' or 'EPERM', results in a [`NoAccessError`](#NoAccessError).
- If the `error` `code` is 'ENOENT', results in a [`NotFoundError`](#NotFoundError).
- If the `error` is an instance of `URIError` and the `wrapUserErrorType` option is `undefined`, results in a
  [`ArgumentInvalidError`](#ArgumentInvalidError).
- If the `error` is an instance of `RangeError` and the `wrapUserErrorType` option is `undefined`, results in a
  [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError).
- If the `error` is an instance of `TypeError` and the `wrapUserErrorType` option is `undefined`, results in a
  [`ArgumentTypeError`](#ArgumentTypeError).
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
| `options.wrapUserErrorType` | `function` | If set, then `URIError`, `RangeError`, and `TypeError` will be wrapped   in a new error of that `Class`. Otherwise, the logic will refer to the [`commonErrorSettings`](#commonErrorSettings)   `wrapUserErrorType`, which if undefined will result in the appropriate [`ArgumentInvalidError`](#ArgumentInvalidError) analog. |

**Returns**: `Array.<Error, boolean>` - An array containing either the original `Error` or the new wrapping `CommonError`
  and a boolean indicating whether the `error` was wrapped (`true`) or not (`false`).

## Presenting errors to users

In a production system, the user should only see the error message, and additional information about the type of the error or where it occurred should not be passed on. This includes in response data which might not be directly displayed to the user, but could be accessed by inspecting the HTTP result, for instance. In particular, the class type and stack trace _should not_ be included in any error response. If this protocol is adopted, then [`maskNoAccessErrors`](#maskNoAccessErrors) _may_ be used.

If this information will be included in response data, then high security systems _should_ use [`NotFoundError`](#NotFoundError) and it's children directly, even when the real problem is one off authorization. In this case, [`maskNoAccessErrors`](#maskNoAccessErrors) _should not_ be used.
