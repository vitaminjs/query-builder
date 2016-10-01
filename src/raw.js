
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
  
  get type() {
    return 'raw'
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
  
  toString() {
    return this.toSQL()
  }
  
  getBindings() {
    return this.bindings
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
  
  reset() {
    this.expression = ''
    this.bindings = []
    this.before = ''
    this.after = ''
    
    return this
  }
  
}