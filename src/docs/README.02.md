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