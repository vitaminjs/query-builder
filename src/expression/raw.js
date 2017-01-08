
import { isArray } from 'lodash'

/**
 * @class Raw
 */
export default class {
  
  /**
   * 
   * @param {String} expression
   * @param {Array} bindings
   * @constructor
   */
  constructor(expression, bindings = []) {
    if (! isArray(bindings) ) bindings = [bindings]
    
    this.expression = expression
    this.bindings = bindings
    this.name = null
    this.before = ''
    this.after = ''
    
    return this
  }
  
  /**
   * 
   * @param {String} before
   * @param {String} after
   * @return this raw
   */
  wrap(before = '(', after = ')') {
    this.before = before
    this.after = after
    return this
  }
  
  /**
   * 
   * @param {String} name
   * @return this raw
   */
  as(name) {
    this.name = name
    return this
  }
  
}