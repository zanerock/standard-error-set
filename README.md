# @liquid-labs/common-errors

A collection of common/standard error types to flesh out Javascripts rather anemic baseline.

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
###  API reference
_API generated with [dmd-readme-api](https://www.npmjs.com/package/dmd-readme-api)._

- Classes:
  - [ArgumentInvalidError](#ArgumentInvalidError): Indicates an invalid argument was passed to a function.
  - [ArgumentMissingError](#ArgumentMissingError): A [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating an argument is missing or empty (typically `null', `undefined`,
or '').
  - [ArgumentOutOfRangeError](#ArgumentOutOfRangeError): A [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating an argument is of the correct time, but outside the acceptable range.
  - [ArgumentTypeError](#ArgumentTypeError): A [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating an argument is not the correct type.
  - [AuthenticationRequiredError](#AuthenticationRequiredError): An [`AuthError`](#AuthError) indicating that an operation requires an authenticated user and the current us not
authenticated.
  - [AuthError](#AuthError): A generic error indicating a problem with user authentication or authorization.
  - [AuthorizationConditionsNotMetError](#AuthorizationConditionsNotMetError): An [`AuthError`](#AuthError) indicating that the user is authorized to perform some action under some circumstances, but
additional conditions must be met.
  - [CommonError](#CommonError): A base class for common errors.
  - [ConnectionError](#ConnectionError): An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem with a connection, including making a connection.
  - [ConstraintViolationError](#ConstraintViolationError): Indicates the requested operation is well formed and the data otherwise correct, but it violates a data constraint.
  - [DataServiceError](#DataServiceError): An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem related to a data service specifically.
  - [DirectoryNotFoundError](#DirectoryNotFoundError): A [`NotFoundError`](#NotFoundError) sub-type indicating there is no file at the requested location.
  - [EndOfStreamError](#EndOfStreamError): An [`IoError`](#IoError) sub-type indicating an attempt to read beyond the of a stream.
  - [ExternalServiceError](#ExternalServiceError): Indicates an error related to an external service.
  - [FileLoadError](#FileLoadError): An [`IoError`](#IoError) indicating a file is present, and can be read, but there is a problem loading it.
  - [FileNotFoundError](#FileNotFoundError): A [`NotFoundError`](#NotFoundError) sub-type indicating there is no file at the requested location.
  - [IoError](#IoError): A generic local I/O error _not_ involving a missing resource.
  - [LocalRollbackError](#LocalRollbackError): An [`IoError`](#IoError) relating to a failed rollback within a database.
  - [LocalTransactionError](#LocalTransactionError): An [`IoError`](#IoError) indicating a problem creating or otherwise involving a transaction within a database system
itself.
  - [NoAccessDirectoryError](#NoAccessDirectoryError): An [`NoAccessError`](#NoAccessError) indicating a user lacks the rights to access a particular directory.
  - [NoAccessError](#NoAccessError): An [`AuthError`](#AuthError) indicating a user lacks the rights to access a particular resource.
  - [NoAccessFileError](#NoAccessFileError): An [`NoAccessError`](#NoAccessError) indicating a user lacks the rights to access a particular file.
  - [NotFoundError](#NotFoundError): An error indicating a resource or entity cannot be found.
  - [NotImplementedError](#NotImplementedError): An error indicating the requested operation is not currently implemented.
  - [NotSupportedError](#NotSupportedError): An error indicating that the resource exists, but does not support some aspect of the request as is.
  - [OperationNotPermittedError](#OperationNotPermittedError): An [`AuthError`](#AuthError) indicating the user lacks authorization to perform some operation.
  - [RollbackError](#RollbackError): A [`DataServiceError`](#DataServiceError) relating to a failed rollback attempt on an external data service.
  - [SystemError](#SystemError): An error indicating a system error.
  - [TimeoutError](#TimeoutError): Indicates an operation is taking too much time.
  - [TransactionError](#TransactionError): A [`DataServiceError`](#DataServiceError) indicating a problem with creating or working with a transaction.
  - [UnavailableError](#UnavailableError): An error indicating that the resource exists, but is not currently available.
  - [UniqueConstraintViolationError](#UniqueConstraintViolationError): A [`ConstraintViolationError`](#ConstraintViolationError) ndicating violation of a unique constraint, such as login ID.
- Functions:
  - [`commonErrorSettings()`](#commonErrorSettings): Used to retrieve and manage options used in [`wrapError`](#wrapError).
  - [`mapErrorToHttpStatus()`](#mapErrorToHttpStatus): Used to translate and manage translation of error names to HTTP status codes.
  - [`mapHttpStatusToName()`](#mapHttpStatusToName): Used to translate and manage mappings from HTTP status codes to names.
  - [`maskNoAccessErrors()`](#maskNoAccessErrors): Remaps [`NoAccessError`](#NoAccessError)s (and all children) to a 404 (Not Found) status and changes the generated message.
  - [`wrapError()`](#wrapError): Wraps an `Error` in a [`CommonError`](#CommonError).

<a id="ArgumentInvalidError"></a>
#### ArgumentInvalidError

Indicates an invalid argument was passed to a function.

Consider whether any of the following errors might be more precise or better suited:
- [`ArgumentMissingError`](#ArgumentMissingError) - For when the argument is required, but missing or empty.
- [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError) - For when the argument is of the proper type, but outside the acceptable range.
- [`ArgumentTypeError`](#ArgumentTypeError) - Indicates an argument is an incorrect type.

[**Source code**](./src/argument-invalid-error.mjs#L16)


<a id="new_ArgumentInvalidError_new"></a>
##### `new ArgumentInvalidError(options)`

The [`ArgumentInvalidError`](#ArgumentInvalidError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` \| `undefined` | The error options. |
| options.packageName | `string` \| `undefined` | The package name (optional). |
| options.functionName | `string` \| `undefined` | The function name (optional). |
| options.argumentName | `string` \| `undefined` | The argument name (optional). |
| options.argumentValue | `string` \| `undefined` | The argument value (optional). Because this is value is ignored   when `undefined`, consider using the string 'undefined' if it's important to display the value. |

**Example**:
```js
new ArgumentInvalidError() // "Function argument is invalid."
// v yields: "Function 'my-package#foo()' argument  is invalid."
new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo'})
// v yields: "Function 'my-package#foo()' argument 'bar' with value '100' is invalid."
new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 100 })
```


<a id="ArgumentMissingError"></a>
#### ArgumentMissingError

A [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating an argument is missing or empty (typically `null', `undefined`,
or '').

Consider whether any of the following errors might be more precise or better suited:
- [`ArgumentInvalidError`](#ArgumentInvalidError) - General argument error when no more specific error fits.
- [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError) - Indicates an argument is of the correct type, but outside the acceptable range.
- [`ArgumentTypeError`](#ArgumentTypeError) - Indicates an argument is an incorrect type.

[**Source code**](./src/argument-missing-error.mjs#L17)


<a id="new_ArgumentMissingError_new"></a>
##### `new ArgumentMissingError(options)`

The [`ArgumentMissingError`](#ArgumentMissingError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` \| `undefined` | The error options. |
| options.packageName | `string` \| `undefined` | The package name (optional). |
| options.functionName | `string` \| `undefined` | The function name (optional). |
| options.argumentName | `string` \| `undefined` | The argument name (optional). |
| options.argumentValue | `string` \| `undefined` | The argument value (optional). Because this is value is ignored   when `undefined`, consider using the string 'undefined' if it's important to display the value. |

**Example**:
```js
new ArgumentInvalidError() // "Function argument is missing or empty."
// v yields: "Function 'my-package#foo()' argument is missing or empty."
new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo'})
// v yields: "Function 'my-package#foo()' argument with value 'undefined' is missing or empty."
new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 'undefined' })
```


<a id="ArgumentOutOfRangeError"></a>
#### ArgumentOutOfRangeError

A [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating an argument is of the correct time, but outside the acceptable range.

Consider whether any of the following errors might be more precise or better suited:
- [`ArgumentInvalidError`](#ArgumentInvalidError) - General argument error when no more specific error fits.
- [`ArgumentMissingError`](#ArgumentMissingError) - For when the argument is required, but missing or empty.
- [`ArgumentTypeError`](#ArgumentTypeError) - Indicates an argument is an incorrect type.

[**Source code**](./src/argument-out-of-range-error.mjs#L16)


<a id="new_ArgumentOutOfRangeError_new"></a>
##### `new ArgumentOutOfRangeError(options)`

The [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` \| `undefined` | The error options. |
| options.packageName | `string` \| `undefined` | The package name (optional). |
| options.functionName | `string` \| `undefined` | The function name (optional). |
| options.argumentName | `string` \| `undefined` | The argument name (optional). |
| options.argumentValue | `string` \| `undefined` | The argument value (optional). Because this is value is ignored   when `undefined`, consider using the string 'undefined' if it's important to display the value. |
| options.max | `string` \| `number` \| `undefined` | The maximum value; the value must be less than or equal to this. |
| options.maxBoundary | `string` \| `number` \| `undefined` | The upper value boundary; the value must be less than this. This value will be ignored if `max` is set. |
| options.min | `string` \| `number` \| `undefined` | The minimum; the value must be greater than or equal to this.` |
| options.minBoundary | `string` \| `number` \| `undefined` | The lower value boundary; the value must be greater than this. This value will be ignored if `min` is set. |

**Example**:
```js
new ArgumentOutOfRangeError() // "Function argument is out of range."
// v yields: "Function 'foo()' argument is out of range. Value must be greater than or equal to 24."
new ArgumentOutOfRangeError({ functionName: 'foo', argumentValue: 12, min: 24 })
// v yields: "Function argument 'bar' with value '100' is out of range. Value must be greater than or equal to 'C' and less than 'D'."
new ArgumentInvalidError({ argumentName: 'bar', argumentValue: 'Bob', min: 'C', maxBoundary: 'D' })
```


<a id="ArgumentTypeError"></a>
#### ArgumentTypeError

A [`ArgumentInvalidError`](#ArgumentInvalidError) sub-type indicating an argument is not the correct type.

Consider whether any of the following errors might be more precise or better suited:
- [`ArgumentInvalidError`](#ArgumentInvalidError) - General argument error when no more specific error fits.
- [`ArgumentMissingError`](#ArgumentMissingError) - Indicates the argument is missing or empty.
- [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError) - Indicates an argument is of the correct type, but outside the acceptable range.

[**Source code**](./src/argument-type-error.mjs#L16)


<a id="new_ArgumentTypeError_new"></a>
##### `new ArgumentTypeError(options)`

The [`ArgumentTypeError`](#ArgumentTypeError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` \| `undefined` | The error options. |
| options.packageName | `string` \| `undefined` | The package name (optional). |
| options.functionName | `string` \| `undefined` | The function name (optional). |
| options.argumentName | `string` \| `undefined` | The argument name (optional). |
| options.argumentValue | `string` \| `undefined` | The value of the argument; though we recommend to leave this   undefined. The value is generally not important since the type is incorrect. |
| options.expectedType | `string` \| `undefined` | The expected type of the argument. |
| options.receivedType | `string` \| `undefined` | The actual type of the argument. |

**Example**:
```js
new ArgumentInvalidError() // "Function argument is missing or empty."
// v yields: "Function 'my-package#foo()' argument is missing or empty."
new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo'})
// v yields: "Function 'my-package#foo()' argument with value 'undefined' is missing or empty."
new ArgumentInvalidError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 'undefined' })
```


<a id="AuthenticationRequiredError"></a>
#### AuthenticationRequiredError

An [`AuthError`](#AuthError) indicating that an operation requires an authenticated user and the current us not
authenticated.

[**Source code**](./src/authentication-required-error.mjs#L10)


<a id="AuthError"></a>
#### AuthError

A generic error indicating a problem with user authentication or authorization. `AuthError` should generally not be
used directly, but instead is intended as a base class for auth related errors allowing consumers to check for auth
related errors broadly (`e.g., instanceof AuthError`). Generally, will want to use one of the following:
- [`AuthenticationRequiredError`](#AuthenticationRequiredError)
- [`BadCredentialsError`](BadCredentialsError)
- [`NoAccessError`](#NoAccessError)
- [`OperationNotPermittedError`](#OperationNotPermittedError)

[**Source code**](./src/auth-error.mjs#L16)


<a id="AuthorizationConditionsNotMetError"></a>
#### AuthorizationConditionsNotMetError

An [`AuthError`](#AuthError) indicating that the user is authorized to perform some action under some circumstances, but
additional conditions must be met. The blocking or necessary conditions should be described if possible.

Consider whether any of the following errors might be more precise or better suited:
- [`AuthenticationRequiredError`](#AuthenticationRequiredError) - Use this when the resource requires authenticated access and the user is not
  currently authenticated.
- [`NoAccessError`](#NoAccessError) - Use this when the user is accessing a resource the user has no authorizations to.
- [`OperationNotPermittedError`](#OperationNotPermittedError) - Use this when user is attempting an operation for which they have no
  authorization.

[**Source code**](./src/authorization-conditions-not-met-error.mjs#L18)


<a id="new_AuthorizationConditionsNotMetError_new"></a>
##### `new AuthorizationConditionsNotMetError(options)`

Constructor for the [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError).

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` \| `undefined` | The constructor options. |
| options.action | `string` \| `undefined` | A description of the action being taken. This should identify the target   resource/entity where appropriate. E.g., 'accessing the database' or 'updating customer data'. |
| options.hint | `string` \| `undefined` | A description of what the user might do to remedy the situation. This   should be a complete sentence. E.g., 'You may contact customer service and request a quota increase.', or 'Try   again in a few minutes.' |
| options.issue | `string` \| `undefined` | A description of the problem. E.g., 'the user is over request quota', or   'this operation is only allowed between 0900 and 1700'. |

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
#### CommonError

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

[**Source code**](./src/common-error.mjs#L24)


<a id="new_CommonError_new"></a>
##### `new CommonError(options)`


| Param | Type | Description |
| --- | --- | --- |
| options | `object` \| `undefined` | Creation objects. |
| options.name | `string` | The name of error. In general, this should match the final class name. |
| options.message | `string` | The error message. |
| options.status | `number` | (optional) The status override for this particular error instance. |
| options.options | `object` \| `undefined` | The options to pass to the `Error` super-constructor. |


<a id="ConnectionError"></a>
#### ConnectionError

An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem with a connection, including making a connection. The
standard instance `message` is determined by the `code` instance field, which indicates the specific nature of the
connection error. Recall that due to [error code hoisting](#error-code-hoisting), the `code` of the `cause` `Error`
will set the `ConnectionError` `code` (unless the constructor options `code` is set or `noHoistCode` is `true`) and
the hoisted `code` will determine the standard message (unless the `message` option is defined).`

[**Source code**](./src/connection-error.mjs#L16)


<a id="new_ConnectionError_new"></a>
##### `new ConnectionError(options)`

Constructor for the [`ConnectionError`](#ConnectionError) class.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` | The constructor options. |
| options.issue | `string` \| `undefined` | Typically left `undefined` and determined automatically. Describes the   specific issue.` |
| options.target | `string` \| `undefined` | The name or description of the connection target. |

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
#### ConstraintViolationError

Indicates the requested operation is well formed and the data otherwise correct, but it violates a data constraint.
`ConstraintViolationError` is distinguished from [`ArgumentInvalidError`](#ArgumentInvalidError) in that argument errors are evaluated
at the function level, while constraint violations result from database constraints.

[**Source code**](./src/constraint-violation-error.mjs#L12)


<a id="DataServiceError"></a>
#### DataServiceError

An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem related to a data service specifically. Consider
whether any of the following errors might be more precise or better suited:
- [`ConnectionError`](#ConnectionError)
- [`ConstraintViolationError`](#ConstraintViolationError)
- [`RollbackError`](#RollbackError)
- [`TransactionError`](#TransactionError)
- [`UniqueConstraintViolationError`](#UniqueConstraintViolationError)

[**Source code**](./src/data-service-error.mjs#L16)


<a id="DirectoryNotFoundError"></a>
#### DirectoryNotFoundError

A [`NotFoundError`](#NotFoundError) sub-type indicating there is no file at the requested location. If both `dirPath` and
`fileName` are specified, `DirectoryNotFound` tries to be smart about joining them and will try and guess the proper path
separator and whether it needs to be appended or not.

[**Source code**](./src/directory-not-found-error.mjs#L19)


<a id="new_DirectoryNotFoundError_new"></a>
##### `new DirectoryNotFoundError(dirPath, resource)`


| Param | Type | Description |
| --- | --- | --- |
| dirPath | `string` \| `undefined` | The directory (not including the file itself) where the file is located. |
| resource | `string` \| `undefined` | Should usually be left undefined. If set, then the value will override   `dirPath` and be used to generate the standard message if `message` option not set. |

**Example**:
```js
new DirectoryNotFound() // "Directory not found."
new DirectoryNotFound({ dirPath: '/my-dir' }) // "Directory '/my-dir' not found."
```


<a id="EndOfStreamError"></a>
#### EndOfStreamError

An [`IoError`](#IoError) sub-type indicating an attempt to read beyond the of a stream.

[**Source code**](./src/end-of-stream-error.mjs#L9)


<a id="ExternalServiceError"></a>
#### ExternalServiceError

Indicates an error related to an external service.

[**Source code**](./src/external-service-error.mjs#L9)


<a id="FileLoadError"></a>
#### FileLoadError

An [`IoError`](#IoError) indicating a file is present, and can be read, but there is a problem loading it.

[**Source code**](./src/file-load-error.mjs#L9)


<a id="FileNotFoundError"></a>
#### FileNotFoundError

A [`NotFoundError`](#NotFoundError) sub-type indicating there is no file at the requested location. If both `dirPath` and
`fileName` are specified, `FileNotFound` tries to be smart about joining them and will try and guess the proper path
separator and whether it needs to be appended or not.

[**Source code**](./src/file-not-found-error.mjs#L25)


<a id="new_FileNotFoundError_new"></a>
##### `new FileNotFoundError(dirPath, fileName, resource)`


| Param | Type | Description |
| --- | --- | --- |
| dirPath | `string` \| `undefined` | The directory (not including the file itself) where the file is located. |
| fileName | `string` \| `undefined` | The name of the file itself. May be a full path (in which case `dirPath` should   be left undefined) or just the file name, in which case it is combined with `dirPath`, if present, to create the   standard error message. |
| resource | `string` \| `undefined` | Should usually be left undefined. If set, then the value will override   `fileName` and `dirPath` and be used to generate the standard message if `message` option not set. |

**Example**:
```js
new FileNotFound() // "File not found."
new FileNotFound({ fileName: 'foo.txt' }) // "File 'foo.txt' not found."
new FileNotFound({ dirPath: '/tmp', fileName: 'foo.txt'}) // "File '/tmp/foo.txt' not found."
new FileNotFound({ dirPath: '/tmp/', fileName: 'foo.txt'}) // "File '/tmp/foo.txt' not found."
new FileNotFound({ dirPath: '/this-is-weird' }) // "File in directory '/this-is-weird' not found."
```


<a id="IoError"></a>
#### IoError

A generic local I/O error _not_ involving a missing resource. Note that `IoError`s are specifically locally and
external service, or remote connections errors are therefore not I/O errors.

[**Source code**](./src/io-error.mjs#L10)


<a id="LocalRollbackError"></a>
#### LocalRollbackError

An [`IoError`](#IoError) relating to a failed rollback within a database. Use [`RollbackError`](#RollbackError) on the client side to
indicate a failed rollback in an external data service.

[**Source code**](./src/local-rollback-error.mjs#L11)


<a id="LocalTransactionError"></a>
#### LocalTransactionError

An [`IoError`](#IoError) indicating a problem creating or otherwise involving a transaction within a database system
itself. Use [`TransactionError`](#TransactionError) for transaction errors related to transactions in an external database service.

[**Source code**](./src/local-transaction-error.mjs#L11)


<a id="NoAccessDirectoryError"></a>
#### NoAccessDirectoryError

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

[**Source code**](./src/no-access-directory-error.mjs#L25)


<a id="new_NoAccessDirectoryError_new"></a>
##### `new NoAccessDirectoryError(dirPath, resource)`


| Param | Type | Description |
| --- | --- | --- |
| dirPath | `string` \| `undefined` | The directory (not including the file itself) where the file is located. |
| resource | `string` \| `undefined` | Should usually be left undefined. If set, then the value will override   `dirPath` and be used to generate the standard message if `message` option not set.} |


<a id="NoAccessError"></a>
#### NoAccessError

An [`AuthError`](#AuthError) indicating a user lacks the rights to access a particular resource. This error is most
appropriate when trying to read or write something. If the user is attempting to perform an operation, consider the
{@OperationNotPermittedError}. Note, in high security systems, it is often desirable to tell the user a resource was
'not found', even when the problem is really an access issue, use and see [`maskNoAccessErrors`](#maskNoAccessErrors) to deal with
this situation.

Consider whether any of the following errors might be more precise or better suited:
- [`AuthenticationRequiredError`](#AuthenticationRequiredError) - Use this when the resource requires authenticated access and the user is not
  currently authenticated.
- [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError) - Use this when the user is authorized to access the resource under
  some conditions.
- [`NoAccessDirectoryError`](#NoAccessDirectoryError)
- [`NoAccessFileError`](#NoAccessFileError)
- [`OperationNotPermittedError`](#OperationNotPermittedError)

[**Source code**](./src/no-access-error.mjs#L24)


<a id="NoAccessFileError"></a>
#### NoAccessFileError

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

[**Source code**](./src/no-access-file-error.mjs#L28)


<a id="new_NoAccessFileError_new"></a>
##### `new NoAccessFileError(dirPath, fileName, resource)`


| Param | Type | Description |
| --- | --- | --- |
| dirPath | `string` \| `undefined` | The directory (not including the file itself) where the file is located. |
| fileName | `string` \| `undefined` | The name of the file itself. May be a full path (in which case `dirPath` should   be left undefined) or just the file name, in which case it is combined with `dirPath`, if present, to create the   standard error message. |
| resource | `string` \| `undefined` | Should usually be left undefined. If set, then the value will override   `fileName` and `dirPath` and be used to generate the standard message if `message` option not set. |


<a id="NotFoundError"></a>
#### NotFoundError

An error indicating a resource or entity cannot be found. This error is used with local and remote resources/entities
where the fundamental issue is the named thing not being present.

[**Source code**](./src/not-found-error.mjs#L11)


<a id="NotImplementedError"></a>
#### NotImplementedError

An error indicating the requested operation is not currently implemented.

Consider whether any of the following errors might be more precise or better suited:
- [`NotSupportedError`](#NotSupportedError) - Use this when the target is implemented, but does not support some feature or
  condition captured in the request.
- [`UnavailableError`](#UnavailableError) - Use this when a resource exists, but is temporarily unavailable for some reason.

[**Source code**](./src/not-implemented-error.mjs#L15)


<a id="new_NotImplementedError_new"></a>
##### `new NotImplementedError(options)`

Constructor for {$link NotImplementedError}.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` | The input options. |
| options.target | `string` \| `undefined` | The name of the function, endpoint, service, etc. which the user is   trying to invoke. |

**Example**:
```js
new NotImplementedError() // "Action not currently implemented."
new NotImplementedError({ target: '/some/url/endpoint'}) // "'/some/url/endpoint' is not currently implemented."
```


<a id="NotSupportedError"></a>
#### NotSupportedError

An error indicating that the resource exists, but does not support some aspect of the request as is. This is most
typically used when implementing a specification, but where some feature of the specification is not implemented.
E.g., let's say a specification says requests can use JSON or YAML, but we only implement JSON support. If we get a
request with a YAML payload, we could throw a `NotSUpportedError`.

Consider whether any of the following errors might be more precise or better suited:
- [`NotImplementedError`](#NotImplementedError) - Use this when the target is not implemented at all.
- [`UnavailableError`](#UnavailableError) - Use this when the target is implemented, but temporarily unavailable for some reason.

[**Source code**](./src/not-supported-error.mjs#L17)


<a id="new_NotSupportedError_new"></a>
##### `new NotSupportedError(options)`

Constructor for {$link NotSupportedError}.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` | The input options. |
| options.issue | `string` \| `undefined` | A short description of the thing which is not supported. E.g., 'YAML   request payloads' or 'asynchronous execution'. |
| options.hint | `string` \| `undefined` | A short hint to the user as to how they might resolve or workaround the   issue. This should be a complete sentence. E.g., 'Encode request in JSON.' or 'Try synchronous execution.' |
| options.target | `string` \| `undefined` | The name of the function, endpoint, service, etc. which the user is   trying to invoke. E.g., '/some/url/endpoint' or 'myFunction()' |

**Example**:
```js
new NotSupportedError() // "The target does not currently support a requested feature."
// v "'/some/endpoint' does not currently support some requested feature."
new NotSupportedError({ target: '/some/endpoint'})
// v "'myFunc()' does not currently support RFC 3339 style dates."
new NotSupportedError({ target: 'myFunc()', issue: 'RFC 3339 style dates' })
// v "The target does not currently support YAML payloads. Send request in JSON."
new NotSupportedError({ issue: 'YAML payloads', hint : 'Send request in JSON.' })
```


<a id="OperationNotPermittedError"></a>
#### OperationNotPermittedError

An [`AuthError`](#AuthError) indicating the user lacks authorization to perform some operation. This is most appropriate
when the user is trying to _do_ something. If the user is attempting to "access" a resource, the [`NoAccessError`](#NoAccessError) or it's children may be better suited. Consider whether any of the following errors might be more
precise or better suited:
- [`AuthenticationError`](AuthenticationError)
- [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError) - Use this when the user is authorized to perform the operation under
  some conditions.
- [`BadCredentialsError`](BadCredentialsError)
- [`AuthorizationConditionsNotMetError`](#AuthorizationConditionsNotMetError)
- [`NoAccessError`](#NoAccessError)

[**Source code**](./src/operation-not-permitted-error.mjs#L19)


<a id="RollbackError"></a>
#### RollbackError

A [`DataServiceError`](#DataServiceError) relating to a failed rollback attempt on an external data service. Use [`LocalRollbackError`](#LocalRollbackError) within a database implementation itself.

[**Source code**](./src/rollback-error.mjs#L11)


<a id="SystemError"></a>
#### SystemError

An error indicating a system error. When used to wrap native system errors (like `ReferenceError`, `SyntaxError`, etc.), be sure to set the `cause` option.

[**Source code**](./src/system-error.mjs#L9)


<a id="new_SystemError_new"></a>
##### `new SystemError(options)`

Constructor for {$link SystemError}.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` | The constructor options. |
| options.resource | `string` \| `undefined` | The name or short description of the resource which has run out of   memory. |

**Example**:
```js
new SystemError() // "The process has experienced a System."
// v "The application has experienced a stack overflow."
new SystemError({ resource: 'application'})
```


<a id="TimeoutError"></a>
#### TimeoutError

Indicates an operation is taking too much time.

[**Source code**](./src/timeout-error.mjs#L9)


<a id="new_TimeoutError_new"></a>
##### `new TimeoutError(options)`

The [`TimeoutError`](#TimeoutError) constructor.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` | The constructor options. |
| options.resource | `string` \| `undefined` | The name or short description of the thing which is timing out. |

**Example**:
```js
// new TimeoutError() // "The process has timed out."
// new TimeoutError({ resource : 'user session' }) // "The user session has timed out."
```


<a id="TransactionError"></a>
#### TransactionError

A [`DataServiceError`](#DataServiceError) indicating a problem with creating or working with a transaction. Note, this error is
specifically for problems arising with an external data service; use [`LocalTransactionError`](#LocalTransactionError) for error or
otherwise involving a transaction within a database system itself.

[**Source code**](./src/transaction-error.mjs#L12)


<a id="UnavailableError"></a>
#### UnavailableError

An error indicating that the resource exists, but is not currently available. This represents a temporary condition.

Consider whether any of the following errors might be more precise or better suited:
- [`NotImplementedError`](#NotImplementedError) - Use this when the target is not implemented at all.
- [`NotSupportedError`](#NotSupportedError) - Use this when the target is implemented, but doesn't support some requested feature.

[**Source code**](./src/unavailable-error.mjs#L14)


<a id="new_UnavailableError_new"></a>
##### `new UnavailableError(options)`

Constructor for {$link UnavailableError}.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` | The input options. |
| options.expectedTime | `string` \| `undefined` | A short description as to when the resource might be available. E.g., 'after 1400' or 'in two hours'. |
| options.target | `string` \| `undefined` | The name of the function, endpoint, service, etc. which the user is   trying to invoke. E.g., '/some/url/endpoint' or 'myFunction()' |

**Example**:
```js
new UnavailableError() // "The target is currently unavailable.
// v "'/some/endpoint' is not currently available."
new UnavailableError({ target: '/some/endpoint'})
// v "'/some/endpoint' is not currently available, try again after 12:00 Saturday.'
new UnavailableError({ target: '/some/endpoint', expectedTime: 'after 12:00 Saturday' })
```


<a id="UniqueConstraintViolationError"></a>
#### UniqueConstraintViolationError

A [`ConstraintViolationError`](#ConstraintViolationError) ndicating violation of a unique constraint, such as login ID.

[**Source code**](./src/unique-constraint-violation-error.mjs#L18)


<a id="new_UniqueConstraintViolationError_new"></a>
##### `new UniqueConstraintViolationError(options)`


| Param | Type | Description |
| --- | --- | --- |
| options | `object` \| `undefined` | The error options. |
| options.entityType | `string` \| `undefined` | The "type" of entity (e.g., 'user'; optional). |
| options.fieldAndValues | `Array.<string>` \| `Array.<Array.string>` | An array of either field names and/or arrays of   field name + field value (optional). You may mix and match, e.g., `['field1', ['field2', 'value2']`. |
| options.message | `string` \| `undefined` | The explicit error message to use (rather than generating an error   message) (optional). |
| options.status | `number` \| `undefined` | The HTTP status code to use on this error instance (optional); will be   mapped to default if not provided. |
| options.options | `object` \| `undefined` | The remainder of the options are passed to the `Error` super-constructor. |


<a id="commonErrorSettings"></a>
#### `commonErrorSettings(option, value)`

Used to retrieve and manage options used in [`wrapError`](#wrapError).
- To retrieve a setting, call `commonErrorSettings(option)` (where `option` is a `string`).
- To add/override a single setting, call `commonErrorSettings(option, value)`.
- To bulk add/override settings, call `commonErrorSettings(/mappings)` (where `mappings is an `Object`).
- To reset the custom settings to default, call `commonErrorSettings()`.

Currently, we support two settings (see [`wrapError`](#wrapError) for details):
- `noInstanceHidingOnWrap` - Controls whether or not errors that are not class `Error` are wrapped or not.
- `wrapUserErrorType` - Controls the resulting class when wrapping errors associated with bad user input.


| Param | Type | Description |
| --- | --- | --- |
| option | `string` \| `object` | Then name of the setting, or bulk settings `Object`. |
| value | `boolean` \| `Class` \| `undefined` | The value of the setting. |

[**Source code**](./src/common-error-settings.mjs#L25)


<a id="mapErrorToHttpStatus"></a>
#### `mapErrorToHttpStatus(errorRef, status)` ⇒ `number` \| `undefined`

Used to translate and manage translation of error names to HTTP status codes. You can use this function to add your
own mappings, which may be useful when dealing with non-common error errors.
- To retrieve a status, call `mapErrorToHttpStatus(errorRef)`.
- To add/override a status mapping, call `mapErrorToHttpStatus(errorRef, status)`.
- To bulk add/override status mappings, call `mapErrorToHttpStatus(mappingObject)` where `mappingObject` is an
  `Object<string,true>`.
- To reset the custom mappings to the default mappings, call `mapErrorToHttpStatus()` with no arguments.


| Param | Type | Description |
| --- | --- | --- |
| errorRef | `string` \| `Error` \| `CommonError.constructor` \| `Object.<string, true>` | The name, instance, or class   (`instanceof ${linkplain CommonError)`) of the error to either retrieve or set status for, or `Object<   string,true>` `for bulk add/override of the custom mappings. |
| status | `number` | An integer value to map the error to. |

**Returns**: `number` \| `undefined` - - Returns an integer if retrieving an error to status mapping, otherwise return
  undefined.

[**Source code**](./src/map-error-to-http-status.mjs#L32)


<a id="mapHttpStatusToName"></a>
#### `mapHttpStatusToName(status, name)` ⇒ `string` \| `undefined`

Used to translate and manage mappings from HTTP status codes to names. Supports all current status defined by the [
IANA](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml), as well as common extensions
returned by IIS, NginX, and Cloudflare.
- To retrieve a status name, call `mapHttpStatusToName(status)` (where `status` is a `string`).
- To add/override a single custom mapping, call `mapHttpStatusToName(status, name)`.
- To bulk add/override custom mappings, call `mapHttpStatusToName(/mappings)` (where `mappings is an `Object`).
- To reset the custom mappings to default, call `mapHttpStatusToName()`.


| Param | Type | Description |
| --- | --- | --- |
| status | `number` \| `Object.<number, string>` | Either the status to retrieve or set mapping for, or an   `Object<number,string>` to bulk update mappings. |
| name | `string` | The name to map a status onto. |

**Returns**: `string` \| `undefined` - - The status name, if known.

[**Source code**](./src/map-http-status-to-name.mjs#L66)


<a id="maskNoAccessErrors"></a>
#### `maskNoAccessErrors()`

Remaps [`NoAccessError`](#NoAccessError)s (and all children) to a 404 (Not Found) status and changes the generated message. This
will effectively remap and custom mappings of [`NoAccessError`](#NoAccessError) or it's children that may be in place. This  is a
common practice in secure systems where it is undesirable to give attackers any information about a resource they
don't have access to. I.e., if a user tries to access a resource they are not permitted to access, an unmasked [`NoAccessError`](#NoAccessError) would divulge the existence of a resource. Note, this does not change the class of the error itself,
so and developers _should_ continue to use [`NoAccessError`](#NoAccessError)s where the problem is actually access. In
production systems, the [presentation of errors to the users](#presenting-errors-to-users) should not indicate the
underlying type.

[**Source code**](./src/mask-no-access-errors.mjs#L16)


<a id="wrapError"></a>
#### `wrapError(error, options)` ⇒ `Array.<Error, boolean>`

Wraps an `Error` in a [`CommonError`](#CommonError). The `error` parameter will be set as the `cause` field of the new 
`CommonError` instance (unless `cause` is specifically set in the `options`).

The wrapping logic is as follows:
- If the `noInstanceHidingOnWrap` is `true` and the `error` class is anything but `Error` 
  (`error.prototype.constructor !== 'Error'`), then results in the original error.
- If the `error` `code` indicates a connection error, results in a [`ConnectionError`](#ConnectionError).
- If the `error` `code` is 'EACCESS' or 'EPERM', results in a [`NoAccessError`](#NoAccessError).
- If the `error` `code` is 'ENOENT', results in a [`NotFoundError`](#NotFoundError).
- If the `error` is an instance of `URIError` and the `wrapUserErrorType` option is `undefined`, results in a 
  {@ArgumentInvalidError}.
- If the `error` is an instance of `RangeError` and the `wrapUserErrorType` option is `undefined`, results in a 
  [`ArgumentOutOfRangeError`](#ArgumentOutOfRangeError).
- If the `error` is an instance of `TypeError` and the `wrapUserErrorType` option is `undefined`, results in a
  [`ArgumentTypeError`](#ArgumentTypeError).
- If the `error` in an instance of `ReferenceError` or `SyntaxError`, results in a {@SystemError}.
- Otherwise, results in a [`CommonError`](#CommonError).

Note, there is no special handling for `EvalError` (which [is no longer in 
use](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError)) or `CommonError` 
(which is 
[non-standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/InternalError)).


| Param | Type | Description |
| --- | --- | --- |
| error | `Error` | The `Error` to be wrapped. |
| options | `object` | The options controlling some wrapping and also passed to the wrapping `CommonError`    constructor. |
| options.noInstanceHidingOnWrap | `boolean` | If true, then if the `error` class is anything but `Error`, the    original `error` will be return as is. If `undefined`, then the logic will refer to the [`commonErrorSettings`](#commonErrorSettings) `noInstanceHidingOnWrap` option value. |
| options.wrapUserErrorType | `Class` | If set, then `URIError`, `RangeError`, and `TypeError` will be wrapped in    a new error of that `Class`. Otherwise, the logic will refer to the [`commonErrorSettings`](#commonErrorSettings)    `wrapUserErrorType`, which if undefined will result in the appropriate {@ArgumentInvalidError} analog. |

**Returns**: `Array.<Error, boolean>` - - An array containing either the original `Error` or the new wrapping `CommonError` 
  and a boolean indicating whether the `error` was wrapped (`true`) or not (`false`).

[**Source code**](./src/wrap-error.mjs#L46)


## Presenting errors to users

In a production system, the user should only see the error message, and additional information about the type of the error or where it occurred should not be passed on. This includes in response data which might not be directly displayed to the user, but could be accessed by inspecting the HTTP result, for instance. In particular, the class type and stack trace _should not_ be included in any error response. If this protocol is adopted, then {@link maskNoAccessErrors} _may_ be used.

If this information will be included in response data, then high security systems _should_ use {@link NotFoundError} and it's children directly, even when the real problem is one off authorization. In this case, {@link maskNoAccessErrors} _should not_ be used.

## Rejected error types

### Socket errors

We considered a `SocketError`, but the issue here is that "sockets" may be local or remote, and those are essentially different animals. A local error would naturally derive from {@link IoError} while a remote socket error would derive from {@link ConnectionError}. We also have {@link ConnectionReset} which should be used in the case a socket connection is reset, so this ground is essentially already covered by these errors and we don't see a lot of utility in introducing two additional classes just to represent local, IO related socket errors and remote, connection related socket errors specifically.

### Specialized system errors

We provide a single {@link SystemError} to use for wrapping native errors like `SyntaxError`, `ReferenceError`, `EvalError`, etc. We use a single error (rather than a counterpart to each of the native `Error`s) for a few reasons.

Our {@CommonError}s are mainly about improving response processing (e.g., by providing HTTP status codes) and better managing error handling with more meaningful error types. The native errors represent, however, represent bugs and generally can't be handled in the same process they occur. E.g., if you have `SyntaxError`, the code is simply invalid and there's nothing much to do.

In cases, where you might want to handle native errors, they can always be wrapped in `SystemError` or a more expressive type. E.g., if we `eval()` user input, and the input is invalid, that would be an `ArgumentInvalidException`.