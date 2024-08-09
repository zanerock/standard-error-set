import { jsVariableRE } from 'regex-repo'

const generateErrorClass = (name, { 
  args, // will set default after validation
  extends: extendsClass = Error,
  generateMessage = () => this.message, 
  globalize = true 
} = {}) => {
  const functionRef = '@liquid-labs/common-errors#generateClass'

  if (jsVariableRE.test(name) !== true) {
    throw new InvalidArgumentError({ 
      message: `Function '${functionRef}' argument 'name' is not a valid Javascript variable name.`
    })
  }
  if (args !== undefined) {
    if (!Array.isArray(args)) {
      throw new InvalidArgumentError({
        message: `Function '${functionRef}' argument 'args' must be an array of valid Javascript variable names.`
      })
    }
    else {
      for (const arg of args) {
        if (jsVariableRE.test(arg) !== true) {
          throw new InvalidArgumentError({
            message: `Function '${functionRef}' argument 'args' contains invalid Javascript variable name '${arg}'.`
          })
        } 
      }
      if (args[args.length - 1] !== 'options') {
        throw new InvalidArgumentError({
          message: `Function '${functionRef}' argument 'args' must end with 'options' arg.`
        })
      }
    }
  }
  args = args || ['message', 'options']

  let classConstructor = function classConstructor(){
    // if(this.global_initialize) this.global_initialize(Class)

    this.args = arguments
    for(var i = 0; i<options.args.length; i++){
      this[options.args[i]] = arguments[i]
    }
    this.options = args[args.length - 1] || {}
    this.name = name
    // if(this.generateMessage) this.message = this.generateMessage()
    this.message = { ...this }.generateMessage()
    this.status = options.status || mapErrorsToHTTPStatus(this.name)
    this.statusName = mapHTTPStatusToName(this.status)
    // Class.captureStackTrace(this, Class)
  }

  let classGeneratorFn = new Function('classConstructor',
    `return function ${name} (${options.args.join(', ')}) {
      if(!(this instanceof ${name})) {
        var instance = Object.create(${name}prototype);
        classConstructor.apply(instance, arguments);
        return instance;
      } else {
        classConstructor.apply(this, arguments);
      }
    }`)
  let Class = classGeneratorFn(classConstructor)

  Class.prototype = Object.create(options.extends.prototype)
  Class.prototype.constructor = Class
  Class.typeName = name
  // Class.super_ = options.extends // Backwards compatible with util.inherits implementation

  // Class.prototype.generateMessage = options.generateMessage

  /*Class.captureStackTrace = function captureStackTrace(error, error_class){
    Error.captureStackTrace(error, error_class);
    if(error.inner_error && error.inner_error.stack) error.stack += "\n--- inner error ---\n" + error.inner_error.stack;
  }*/

  // if(options.globalize) globalize(Class)
  if (globalize === true) {
    if (globalThis !== undefined) {
      globalThis[name] = Class
    } // should the following be in an else-if?
    if (global !== undefined) { // Node
      global[name] = Class
    }
    if (window !== undefined) { // Web
      window[name] = Class
    }
    if (self !== undefined) { // Worker
      self[name] = Class
    }
    if (frames !== undefined) { // HTML frame
      frames[name] = Class
    }
  }

  return Class
}
