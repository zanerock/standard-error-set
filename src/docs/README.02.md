## Presenting errors to users

In a production system, the user should only see the error message, and additional information about the type of the error or where it occurred should not be passed on. This includes in response data which might not be directly displayed to the user, but could be accessed by inspecting the HTTP result, for instance. In particular, the class type and stack trace _should not_ be included in any error response. If this protocol is adopted, then [`maskNoAccessErrors`](#maskNoAccessErrors) _may_ be used.

If this information will be included in response data, then high security systems _should_ use [`NotFoundError`](#NotFoundError) and it's children directly, even when the real problem is one off authorization. In this case, [`maskNoAccessErrors`](#maskNoAccessErrors) _should not_ be used.
