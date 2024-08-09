import { jsVariableRE } from 'regex-repo'

import { mapErrorsToHTTPStatus } from './map-errors-to-http-status'
import { mapHTTPStatusToName } from './lib/map-http-status-to-name'

const generateErrorClass = (name, {
  args, // will set default after validation
  extends: extendsClass = Error,
  generateMessage = () => this.message,
  globalize = true
} = {}) => {
  const functionRef = '@liquid-labs/common-errors#generateClass'

  if (jsVariableRE.test(name) !== true) {
    throw new InvalidArgumentError({
      message : `Function '${functionRef}' argument 'name' is not a valid Javascript variable name.`
    })
  }
  if (args !== undefined) {
    if (!Array.isArray(args)) {
      throw new InvalidArgumentError({
        message : `Function '${functionRef}' argument 'args' must be an array of valid Javascript variable names.`
      })
    } else {
      for (const arg of args) {
        if (jsVariableRE.test(arg) !== true) {
          throw new InvalidArgumentError({
            message : `Function '${functionRef}' argument 'args' contains invalid Javascript variable name '${arg}'.`
          })
        }
      }
      if (args[args.length - 1] !== 'options') {
        throw new InvalidArgumentError({
          message : `Function '${functionRef}' argument 'args' must end with 'options' arg.`
        })
      }
    }
  }
  args = args || ['message', 'options']

  const classCode = `class ${name} extends ${extendsClass} {
    
  }`
  // console.error('classCode:', classCode) // DEBUG
  process.stdout.write('classCode:'+ classCode) // DEBUG
  process.stdout.write('more')

  eval(classCode)
  console.log('Class:', Class)
/*
  const classConstructor = function classConstructor () {
    const options = arguments[arguments.length - 1] || {}
    let superSelf
    if (extendsClass === Error) {
      superSelf = Error.apply(null, ['foo', options])
      console.log('superSelf:', superSelf) // DEBUG
    } else {
      superSelf = extendsClass.apply(null, [options])
    }
    Object.assign(this, superSelf)
    // if(this.global_initialize) this.global_initialize(Class)

    this.args = arguments
    for (let i = 0; i < args.length; i++) {
      this[args[i]] = arguments[i]
    }
    this.options = options
    this.name = name
    // if(this.generateMessage) this.message = this.generateMessage()
    this.message = generateMessage.apply(this)
    this.status = this.options.status || mapErrorsToHTTPStatus(this.name)
    this.statusName = mapHTTPStatusToName(this.status)
    // Class.captureStackTrace(this, Class)
  }

  const classGeneratorFn = new Function('classConstructor', `
    return function ${name} (${args.join(', ')}) {
      if(!(this instanceof ${name})) {
        var instance = Object.create(${name}.prototype);
        classConstructor.apply(instance, arguments);
        return instance;
      } else {
        classConstructor.apply(this, arguments);
      }
    }`)

  /*  const classGeneratorFn = new Function(`
    const classConstructor = function () {
      const options = arguments[arguments.length - 1] || {}
      if (${extendsClass} === Error) {
        this.super('', options)
      }
      else {
        this.super(options)
      }
      // if(this.global_initialize) this.global_initialize(Class)

      this.args = arguments
      for(var i = 0; i < args.length; i++){
        this[args[i]] = arguments[i]
      }
      this.options = options
      this.name = ${name}
      // if(this.generateMessage) this.message = this.generateMessage()
      // this.message = generateMessage.apply(this)
      // this.status = this.options.status || mapErrorsToHTTPStatus(this.name)
      // this.statusName = mapHTTPStatusToName(this.status)
      // Class.captureStackTrace(this, Class)
    }
    return function ${name} (${args.join(', ')}) {
      if(!(this instanceof ${name})) {
        var instance = Object.create(${name}.prototype);
        classConstructor.apply(instance, arguments);
        return instance;
      } else {
        classConstructor.apply(this, arguments);
      }
    }`) */
  /*
  const Class = classGeneratorFn(classConstructor)

  Class.prototype = Object.create(extendsClass.prototype)
  Class.prototype.constructor = Class
  Class.typeName = name
  // Class.super_ = options.extends // Backwards compatible with util.inherits implementation

  // Class.prototype.generateMessage = options.generateMessage

  /* Class.captureStackTrace = function captureStackTrace(error, error_class){
    Error.captureStackTrace(error, error_class);
    if(error.inner_error && error.inner_error.stack) error.stack += "\n--- inner error ---\n" + error.inner_error.stack;
  } */

  // if(options.globalize) globalize(Class)
  if (globalize === true) {
    if (globalThis !== undefined) { // eslint-disable-line no-undef
      globalThis[name] = Class // eslint-disable-line no-undef
    } // should the following be in an else-if?
    if (global !== undefined) { // Node // eslint-disable-line no-undef
      global[name] = Class // eslint-disable-line no-undef
    }
    // Web
    if (window !== undefined) { // eslint-disable-line no-undef
      window[name] = Class // eslint-disable-line no-undef
    }
    // Worker
    if (self !== undefined) { // eslint-disable-line no-undef
      self[name] = Class // eslint-disable-line no-undef
    }
    // HTML frame
    if (frames !== undefined) { // eslint-disable-line no-undef
      frames[name] = Class // eslint-disable-line no-undef
    }
  }

  return Class
}

export { generateErrorClass }
