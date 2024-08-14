## Presenting errors to users

In a production context, 

## Rejected error types

### Socket errors

We considered a `SocketError`, but the issue here is that "sockets" may be local or remote, and those are essentially different animals. A local error would naturally derive from {@link IoError} while a remote socket error would derive from {@link ConnectionError}. We also have {@link ConnectionReset} which should be used in the case a socket connection is reset, so this ground is essentially already covered by these errors and we don't see a lot of utility in introducing two additional classes just to represent local, IO related socket errors and remote, connection related socket errors specifically.