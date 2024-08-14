# @liquid-labs/common-errors

A collection of common/standard error types to flesh out Javascripts rather anemic baseline.

## API

### Common parameters

The following parameter options are accepted by all {@link CommonError} error constructors. We document them here to save space and avoid repeating them for each error class. They are all optional.

- `cause` {`Error`|`undefined`}: The error that caused this error. This is useful for wrapping a more generic error in a more specific error or chaining related errors across an error boundary (e.g., asynchronous calls).
- `message` (`string`|`undefined`): All {@link CommonError} classes generate a standard message, based on class specific input parameters (if any). You can always override this message and provide your own custom message.
- `status` (`number`|`undefined`): All {@link CommonError} classes are assigned an HTTP status based on their error type. The mapping between error type and status code can be managed with {@link mapErrorToHttpStatus}. This would be unusual, but you can instead set the status on a particular `CommonError` instance with this option.

