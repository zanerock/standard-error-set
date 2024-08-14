# @liquid-labs/common-errors

A collection of common/standard error types to flesh out Javascripts rather anemic baseline.

## API

### Common parameters

The following parameter options are accepted by all {@link CommonError} error constructors. We document them here to save space and avoid repeating them for each error class. They are all optional.

- `cause` {`Error`|`undefined`}: The error that caused this error. This is useful for wrapping a more generic error in a more specific error or chaining related errors across an error boundary (e.g., asynchronous calls).
- `message` (`string`|`undefined`): All {@link CommonError} classes generate a standard message, based on class specific input parameters (if any). You can always override this message and provide your own custom message.
- `status` (`number`|`undefined`): All {@link CommonError} classes are assigned an HTTP status based on their error type. The mapping between error type and status code can be managed with {@link mapErrorToHttpStatus}. This would be unusual, but you can instead set the status on a particular `CommonError` instance with this option.

###  API reference
_API generated with [dmd-readme-api](https://www.npmjs.com/package/dmd-readme-api)._

- Classes:
  - [ArgumentMissingError](#ArgumentMissingError): A [`InvalidArgumentError`](#InvalidArgumentError) sub-type indicating an argument is missing or empty (typically `null', `undefined`,
or '').
  - [AuthenticationRequiredError](#AuthenticationRequiredError): An [`AuthError`](#AuthError) indicating that an operation requires an authenticated user and the current us not
authenticated.
  - [AuthError](#AuthError): A generic error indicating a problem with user authentication or authorization.
  - [CommonError](#CommonError): A base class for common errors.
  - [ConnectionError](#ConnectionError): An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem with the connection, including making a connection.
  - [ConnectionResetError](#ConnectionResetError): A [`ConnectionError`](#ConnectionError) sub-type indicating a connection has been reset or closed unexpectedly or while in use.
  - [ConstraintViolationError](#ConstraintViolationError): Indicates the requested operation is well formed and the data otherwise correct, but it violates a data constraint.
  - [DataServiceError](#DataServiceError): An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem related to a data service specifically.
  - [EndOfStreamError](#EndOfStreamError): An [`IoError`](#IoError) sub-type indicating an attempt to read beyond the of a stream.
  - [ExternalServiceError](#ExternalServiceError): Indicates an error related to an external service.
  - [FileLoadError](#FileLoadError): An [`IoError`](#IoError) indicating a file is present, and can be read, but there is a problem loading it.
  - [InvalidArgumentError](#InvalidArgumentError): Indicates an invalid argument was passed to a function.
  - [IoError](#IoError): A generic local I/O error _not_ involving a missing resource.
  - [LocalRollbackError](#LocalRollbackError): An [`IoError`](#IoError) relating to a failed rollback within a database.
  - [LocalTransactionError](#LocalTransactionError): An [`IoError`](#IoError) indicating a problem creating or otherwise involving a transaction within a database system
itself.
  - [NoAccessError](#NoAccessError): An [`AuthError`](#AuthError) indicating a user lacks the rights to access a particular resource.
  - [NotFoundError](#NotFoundError): An error indicating a resource or entity cannot be found.
  - [NotPermittedError](#NotPermittedError): An [`AuthError`](#AuthError) indicating the user lacks authorization to perform some operation.
  - [RollbackError](#RollbackError): A [`DataServiceError`](#DataServiceError) relating to a failed rollback attempt on an external data service.
  - [TransactionError](#TransactionError): A [`DataServiceError`](#DataServiceError) indicating a problem with creating or working with a transaction.
  - [UniqueConstraintViolationError](#UniqueConstraintViolationError): A [`ConstraintViolationError`](#ConstraintViolationError) ndicating violation of a unique constraint, such as login ID.
- Functions:
  - [`hideNoAccessErrors()`](#hideNoAccessErrors): Remaps [`NoAccessError`](#NoAccessError)s to a 404 (Not Found) status and changes the generated message.
  - [`mapErrorToHttpStatus()`](#mapErrorToHttpStatus): Used to translate and manage translation of error names to HTTP status codes.
  - [`mapHttpStatusToName()`](#mapHttpStatusToName): Used to translate and manage mappings from HTTP status codes to names.

<a id="ArgumentMissingError"></a>
#### ArgumentMissingError

A [`InvalidArgumentError`](#InvalidArgumentError) sub-type indicating an argument is missing or empty (typically `null', `undefined`,
or '').

[**Source code**](./src/argument-empty-error.mjs#L10)


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
- [`NotPermittedError`](#NotPermittedError)

[**Source code**](./src/auth-error.mjs#L14)


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

[**Source code**](./src/common-error.mjs#L23)


<a id="new_CommonError_new"></a>
##### `new CommonError(options)`


| Param | Type | Description |
| --- | --- | --- |
| options | `object` | Creation objects. |
| options.name | `string` | The name of error. In general, this should match the class name. |
| options.message | `string` | The error message. |
| options.status | `number` | (optional) The status override for this particular error instance. |
| options.options | `object` | The options to pass to the `Error` super-constructor. |


<a id="ConnectionError"></a>
#### ConnectionError

An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem with the connection, including making a connection.

[**Source code**](./src/connection-error.mjs#L9)


<a id="ConnectionResetError"></a>
#### ConnectionResetError

A [`ConnectionError`](#ConnectionError) sub-type indicating a connection has been reset or closed unexpectedly or while in use.

[**Source code**](./src/connection-reset-error.mjs#L9)


<a id="ConstraintViolationError"></a>
#### ConstraintViolationError

Indicates the requested operation is well formed and the data otherwise correct, but it violates a data constraint.
Consider

[**Source code**](./src/constraint-violation-error.mjs#L10)


<a id="DataServiceError"></a>
#### DataServiceError

An [`ExternalServiceError`](#ExternalServiceError) sub-type indicating a problem related to a data service specifically. Consider
whether any of the following errors might be more precise or better suited:
- [`ConnectionError`](#ConnectionError)
- [`ConstraintViolationError`](#ConstraintViolationError)
- [`RollbackError`](#RollbackError)
- [`TransactionError`](#TransactionError)
- [`UniqueConstraintViolationError`](#UniqueConstraintViolationError)

[**Source code**](./src/data-service-error.mjs#L15)


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


<a id="InvalidArgumentError"></a>
#### InvalidArgumentError

Indicates an invalid argument was passed to a function.

Consider whether any of the following errors might be more precise or better suited:
- [`EmptyArgumentError`](EmptyArgumentError) - Consider this when the argument is required, but missing or empty.
- [`ConstraintViolationError`](#ConstraintViolationError) - Consider this when the argument is of the proper type, but violates some 
  constraint.
- [`UniqueConstraintViolationError`](#UniqueConstraintViolationError) - Consider this when the argument is of the proper type, but violates a 
  unique constraint.

[**Source code**](./src/invalid-argument-error.mjs#L16)


<a id="new_InvalidArgumentError_new"></a>
##### `new InvalidArgumentError(options)`

The [`InvalidArgumentError`](#InvalidArgumentError) constructor.

See the [common parameters](#common-parameters) note for additional parameters.


| Param | Type | Description |
| --- | --- | --- |
| options | `object` | The error options. |
| options.packageName | `string` \| `undefined` | The package name (optional). |
| options.functionName | `string` \| `undefined` | The function name (optional). |
| options.argumentName | `string` \| `undefined` | The argument name (optional). |
| options.argumentValue | `string` \| `undefined` | The argument value (optional). |

**Examples**:
*No arg constructor yields: &quot;Function argument has invalid value.&quot;*:
```js
new InvalidArgumentError()
```
*Partial spec by positional args, yields: &quot;Function &#x27;my-package#foo()&#x27; argument  has invalid value.&quot;*:
```js
new InvalidArgumentError({ packageName: 'my-package', functionName: 'foo'})
```
*Full spec yields: &quot;Function &#x27;my-package#foo()&#x27; argument &#x27;bar&#x27; has invalid value &#x27;100&#x27;.&quot;*:
```js
new InvalidArgumentError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 100 })
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

[**Source code**](./src/local-rollback-error.mjs#L10)


<a id="LocalTransactionError"></a>
#### LocalTransactionError

An [`IoError`](#IoError) indicating a problem creating or otherwise involving a transaction within a database system
itself. Use [`TransactionError`](#TransactionError) for transaction errors related to transactions in an external database service.

[**Source code**](./src/local-transaction-error.mjs#L10)


<a id="NoAccessError"></a>
#### NoAccessError

An [`AuthError`](#AuthError) indicating a user lacks the rights to access a particular resource. Note, in high security
systems, it is often desirable to tell the user a resource was 'not found', even when the problem is really an
access issue, use and see [`hideAccessErrors`](hideAccessErrors) to deal with this situation.

Consider whether any of the following errors might be more precise or better suited:
- [`AuthenticationRequiredError`](#AuthenticationRequiredError) - Use this when the resource requires authenticated access and the user is not
  currently authenticated.
- [`OperationNotPermittedError`](OperationNotPermittedError)

[**Source code**](./src/no-access-error.mjs#L16)


<a id="NotFoundError"></a>
#### NotFoundError

An error indicating a resource or entity cannot be found. This error is used with local and remote resources/entities
where the fundamental issue is the named thing not being present.

[**Source code**](./src/not-found-error.mjs#L10)


<a id="NotPermittedError"></a>
#### NotPermittedError

An [`AuthError`](#AuthError) indicating the user lacks authorization to perform some operation. Consider whether any of the
following errors might be more precise or better suited:
- [`AuthenticationError`](AuthenticationError)
- [`BadCredentialsError`](BadCredentialsError)
- [`AuthorizationConditionsNotMetError`](AuthorizationConditionsNotMetError)
- [`NoAccessError`](#NoAccessError)

[**Source code**](./src/operation-not-permitted-error.mjs#L14)


<a id="RollbackError"></a>
#### RollbackError

A [`DataServiceError`](#DataServiceError) relating to a failed rollback attempt on an external data service. Use [`LocalRollbackError`](#LocalRollbackError) within a database implementation itself.

[**Source code**](./src/rollback-error.mjs#L10)


<a id="TransactionError"></a>
#### TransactionError

A [`DataServiceError`](#DataServiceError) indicating a problem with creating or working with a transaction. Note, this error is
specifically for problems arising with an external data service; use [`LocalTransactionError`](#LocalTransactionError) for error or
otherwise involving a transaction within a database system itself.

[**Source code**](./src/transaction-error.mjs#L11)


<a id="UniqueConstraintViolationError"></a>
#### UniqueConstraintViolationError

A [`ConstraintViolationError`](#ConstraintViolationError) ndicating violation of a unique constraint, such as login ID.

[**Source code**](./src/unique-constraint-violation-error.mjs#L18)


<a id="new_UniqueConstraintViolationError_new"></a>
##### `new UniqueConstraintViolationError(options)`


| Param | Type | Description |
| --- | --- | --- |
| options | `object` | The error options. |
| options.entityType | `string` \| `undefined` | The "type" of entity (e.g., 'user'; optional). |
| options.fieldAndValues | `Array.<string>` \| `Array.<Array.string>` | An array of either field names and/or arrays of   field name + field value (optional). You may mix and match, e.g., `['field1', ['field2', 'value2']`. |
| options.message | `string` \| `undefined` | The explicit error message to use (rather than generating an error   message) (optional). |
| options.status | `number` \| `undefined` | The HTTP status code to use on this error instance (optional); will be   mapped to default if not provided. |
| options.options | `object` \| `undefined` | The remainder of the options are passed to the `Error` super-constructor. |


<a id="hideNoAccessErrors"></a>
#### `hideNoAccessErrors()`

Remaps [`NoAccessError`](#NoAccessError)s to a 404 (Not Found) status and changes the generated message. This is a common
practice in secure systems where it is undesirable to give attackers any information about a resource they don't
have access to. I.e., if a user tries to access a resource they are not permitted to access, a [`NoAccessError`](#NoAccessError)
would divulge the existence of a resource, so instead high security systems will usually prefer a [`NotFoundError`](#NotFoundError) so as to not give anything away. Note, this does not change the class of the error itself, so
one must take care in how [errors are presented to users](#presenting-errors-to-users).

[**Source code**](./src/hide-no-access-errors.mjs#L9)


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
- To retrieve a status name, call `mapHttpStatusToName(status)`.
- To add/override a single custom mapping, call `mapHttpStatusToName(status, name)`.
- To bulk add/override custom mappings, call `mapHttpStatusToName(mappings)`.
- To reset the custom mappings to default, call `mapHttpStatusToName()`.


| Param | Type | Description |
| --- | --- | --- |
| status | `number` \| `Object.<number, string>` | Either the status to retrieve or set mapping for, or an   `Object<number,string>` to bulk update mappings. |
| name | `string` | The name to map a status onto. |

**Returns**: `string` \| `undefined` - - The status name, if known.

[**Source code**](./src/map-http-status-to-name.mjs#L66)


## Presenting errors to users

In a production context, 

## Rejected error types

### Socket errors

We considered a `SocketError`, but the issue here is that "sockets" may be local or remote, and those are essentially different animals. A local error would naturally derive from {@link IoError} while a remote socket error would derive from {@link ConnectionError}. We also have {@link ConnectionReset} which should be used in the case a socket connection is reset, so this ground is essentially already covered by these errors and we don't see a lot of utility in introducing two additional classes just to represent local, IO related socket errors and remote, connection related socket errors specifically.