# Developer Notes

## No `generateErrorClass`

At first, we wanted to try and create [a generator class ala 'common-errors'](https://github.com/shutterstock/node-common-errors/blob/master/lib/helpers/class-generator.js). You can see [the last gasp of our attempts](https://github.com/liquid-labs/common-errors/blob/b632305ae83c96d8bcd647e9a262fc238ce14d17/src/generate-error-class.mjs). However, we were not able to overcome certain limitations.

The biggest things is that we wanted to be able to inherit from `Error` and generate `Error.stack` correctly, as well as leverage platform native `Error` implementation. Normally, this wouldn't be a problem, you'd just declare your class and the `super()` call (implicit or explicit) would correctly generate the stack. However, we couldn't find a way to dynamically create a class and invoke `super()`. The keyword itself is disallowed because we're not using the `class` keyword to generate the error class and attempts to just call the `Error` constructor directly end up generating the stack from that point, and not the original error point (so you end up with a few extra layers stack that point to the inside of the generated error class). Referring to the 'common-errors' approach, we see that it relies on V8 specific implementation (namely `Error.createStackTrace()`).

We may be missing something and there may be ways to overcome these limitations, but for the time being, we're just falling back to directly defining the custom error types. Anyone wishing to create their own custom types can use or build off ours in the normal fashion.
