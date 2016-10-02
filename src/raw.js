
import { isEmpty } from 'underscore'

/**
 * @class Raw
 */
export default class {
  
  /**
   * Raw class constructor
   * 
   * @param {Compiler} compiler
   * @constructor
   */
  constructor(compiler) {
    this.compiler = compiler
    this.expression = ''
    this.bindings = []
    this.before = ''
    this.after = ''
  }
  
  /**
   * 
   * 
   * @param {String} expression
   * @param {Object} bindings
   * @return this raw
   */
  set(expression, bindings = []) {
    this.expression = expression
    this.bindings = bindings
    return this
  }
  
  toSQL() {
    return this.compiler.compileRaw(this)
  }
  
  wrap(before = '(', after = ')') {
    this.before = before
    this.after = after
    return this
  }
  
  as(name) {
    this.name = name
    return this
  }
  
}