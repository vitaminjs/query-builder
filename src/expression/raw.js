
import { isArray, isEqual } from 'lodash'
import Expression from './base'

/**
 * @class Raw
 */
export default class Raw extends Expression {
  
  /**
   * 
   * @param {String} expression
   * @param {Array} bindings
   * @constructor
   */
  constructor(expression, bindings = []) {
    super()
    
    if (! isArray(bindings) ) bindings = [bindings]
    
    this.bindings = bindings
    this.sql = expression
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
  
  /**
   * 
   * @param {String|Compiler} compiler
   * @return string
   */
  compile(compiler) {
    var expr = this.sql.replace(/\?/g, compiler.parameter)
    var sql = compiler.alias(this.before + expr + this.after, this.name)
    
    // add query bindings
    this.bindings.forEach(value => compiler.addBinding(value))
    
    return sql
  }
  
  /**
   * 
   * @param {Any} expr
   * @return boolean
   */
  isEqual(value) {
    return super.isEqual() || (
      value instanceof Raw &&
      value.sql === this.sql &&
      isEqual(value.bindings, this.bindings)
    )
  }
  
}
