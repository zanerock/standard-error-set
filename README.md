# @liquid-labs/common-errors

A collection of common/standard error types to flesh out Javascripts rather anemic baseline.
##  API reference
_API generated with [dmd-readme-api](https://www.npmjs.com/package/dmd-readme-api)._

- Classes:
  - [CommonError](#CommonError): A base class for common errors.
  - [InvalidArgumentError](#InvalidArgumentError): Indicates an invalid argument was passed to a function.
- Functions:
  - [`mapErrorToHttpStatus()`](#mapErrorToHttpStatus): Used to translate and manage translation of error names to HTTP status codes.
  - [`mapHttpStatusToName()`](#mapHttpStatusToName): Used to translate and manage mappings from HTTP status codes to names.
- Typedefs:
  - [`InvalidArgumentOptions`](#InvalidArgumentOptions): The arguments option for `InvalidArgumentError`.

<a id="CommonError"></a>
### CommonError

A base class for common errors. To create a common error of your own, extend this class.
```js
const name = 'MyError'

export const MyError = class extends CommonError {
  constructor(foo, options) {
    const message = `You hit ${foo}!`
    super(name, message, options)
  }
}
MyError.typeName = name
```

[**Source code**](./src/common-error.mjs#L21)


<a id="new_CommonError_new"></a>
#### `new CommonError(name, message, options)`


| Param | Type | Description |
| --- | --- | --- |
| name | `string` | The name of error. In general, this should match the class name. |
| message | `string` | = The error message. |
| options | `object` | The options to pass to the `Error` super-constructor. |


<a id="InvalidArgumentError"></a>
### InvalidArgumentError

Indicates an invalid argument was passed to a function. In general, the easiest way to invoke the constructor is
with a single [`InvalidArgumentOptions`](#InvalidArgumentOptions} option object. The constructor can also be called
with either positional arguments for the function package, function name, argument name, and argument value (in that
order, each optional). In any case, if the final argument is an `Object`, it is treated as an options argument and
the options argument is passed to the `Error` super-constructor (e.g., this is where you would set `cause`, if any).
Finally, if `message` is set directly in the options argument, it will be used  regardless of the presence of other
option fields or positional arguments.

When the argument value is specified, either with positional arguments or as an options field, it will be reported
in the message, if possible. If the value is an `Object`, it will be stringified with `JSON.stringify`. If that is
not possible, then the resulting error message will omit reporting the value and treat the argument value as
`undefined` for the purposes of creating the message. The argument value will still be available in the `
 argumentValue` field on the `InvalidArgumentError` instance.`

When both a positional argument and the corresponding options argument are both set, (e.g., `functionNameOrOptions'
and `options.functionName`), the options field will win out. Also, because if the last argument is treated as the
options argument, you must explicitly set `options` (either `{}` or `null`) if `argumentValueOrOptions` is itself an
object. Otherwise, `argumentValueOrOptions` will be treated as the options argument (and not the argument value) if
`options` is unset or explicitly undefined.

If specified, in either positional arguments, or option fields, `packageName`, `funcitonName`, `argumentName`, and
`argumentValue` will be available as fields on the `InvalidArgumentError` instance.

[**Source code**](./src/invalid-argument-error.mjs#L36)


<a id="new_InvalidArgumentError_new"></a>
#### `new InvalidArgumentError(packageNameOrOptions, functionNameOrOptions, argumentNameOrOptions, argumentValueOrOptions, options)`

The [`InvalidArgumentError`](#InvalidArgumentError) constructor.


| Param | Type | Description |
| --- | --- | --- |
| packageNameOrOptions | `string` \| [`InvalidArgumentOptions`](#InvalidArgumentOptions) \| `undefined` | The package name, a   [`InvalidArgumentOptions`](#InvalidArgumentOptions) object, or undefined (which will omit the package name from   the message unless specified in a final options argument). |
| functionNameOrOptions | `string` \| [`InvalidArgumentOptions`](#InvalidArgumentOptions) \| `undefined` | The function name, a   [`InvalidArgumentOptions`](#InvalidArgumentOptions) object, or undefined (which will omit the function name from   the message unless specified in a final options argument). |
| argumentNameOrOptions | `string` \| [`InvalidArgumentOptions`](#InvalidArgumentOptions) \| `undefined` | The argument name, a   [`InvalidArgumentOptions`](#InvalidArgumentOptions) object, or undefined (which will omit the argument name from |
| argumentValueOrOptions | `string` \| [`InvalidArgumentOptions`](#InvalidArgumentOptions) \| `undefined` | The argument value, a   [`InvalidArgumentOptions`](#InvalidArgumentOptions) object, or undefined (which will omit the argument value   from the message unless specified in a final options argument). If the value is an `Object`, you must provide a   final `options` argument, which may be `{}`, `null`, but not `undefined`. See function documentation for   treatment of `Object` values in any generated message. |
| options | [`InvalidArgumentOptions`](#InvalidArgumentOptions) \| `undefined` | The final options `Object`, if any, which is passed to the   `Error` super-constructor and whose values can override the positional arguments. |

**Examples**:
*No arg constructor yields: &quot;Function argument has invalid value.&quot;*:
```js
new InvalidArgumentError()
```
*Partial spec by positional args, yields: &quot;Function &#x27;my-package#foo()&#x27; argument  has invalid value.&quot;*:
```js
new InvalidArgumentError('my-package', 'foo')
```
*Partial spec by options, yields: &quot;Function &#x27;my-package#foo()&#x27; argument has invalid value.&quot;*:
```js
new InvalidArgumentError({ packageName: 'my-package', functionName: 'foo'})
```
*Full spec yields: &quot;Function &#x27;my-package#foo()&#x27; argument &#x27;bar&#x27; has invalid value &#x27;100&#x27;.&quot;*:
```js
new InvalidArgumentError({ packageName: 'my-package', functionName: 'foo', argumentName: 'bar', argumentValue: 100 })
```


<a id="mapErrorToHttpStatus"></a>
### `mapErrorToHttpStatus(errorRef, status)` ⇒ `number` \| `undefined`

Used to translate and manage translation of error names to HTTP status codes. You can use this function to add your 
own mappings, which may be useful when dealing with non-common error errors.
- To retrieve a status, call `mapErrorToHttpStatus(errorRef)`.
- To add/override a status mapping, call `mapErrorToHttpStatus(errorRef, status)`.
- To bulk add/override status mappings, call `mapErrorToHttpStatus(mappingObject)` where `mappingObject` is an
  `Object<string,true>`.
- To reset the custom mappings to the default mappings, call `mapErrorToHttpStatus()` with no arguments.


| Param | Type | Description |
| --- | --- | --- |
| errorRef | `string` \| `Error` \| `CommonError.constructor` \| `Object.<string, true>` | The name, instance, or class    (`instanceof ${linkplain CommonError)`) of the error to either retrieve or set status for, or `Object<   string,true>` `for bulk add/override of the custom mappings. |
| status | `number` | An integer value to map the error to. |

**Returns**: `number` \| `undefined` - - Returns an integer if retrieving an error to status mapping, otherwise return
  undefined.

[**Source code**](./src/map-error-to-http-status.mjs#L25)


<a id="mapHttpStatusToName"></a>
### `mapHttpStatusToName(status, name)`

Used to translate and manage mappings from HTTP status codes to names. Supports all current status defined by the [
IANA](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml), as well as common extensions 
returned by IIS, NginX, and Cloudflare.
- To retrieve a status name, call `mapHttpStatusToName(status)`.
- To add/override a single custom mapping, call `mapHttpStatusToName(status, name)`.
- To bulk add/override custom mappings, call `mapHttpStatusToName(mappings)`.
- To reset the custom mappings to default, call `mapHttpStatusToName()`.


| Param | Type | Description |
| --- | --- | --- |
| status | `number` \| `Object.<number, string>` | Either the status to retrieve or set mapping for, or an    `Object<number,string>` to bulk update mappings. |
| name | `string` | The name to map a status onto. |

[**Source code**](./src/map-http-status-to-name.mjs#L64)


<a id="InvalidArgumentOptions"></a>
### `InvalidArgumentOptions`

The arguments option for `InvalidArgumentError`. These options are also passed to the `Error` constructor, which may
recognize additional options.

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| functionName | `string` | The name of the function to use in any generated message. |

[**Source code**](./src/invalid-argument-error.mjs#L5)


