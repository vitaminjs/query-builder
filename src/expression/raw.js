
import { isArray, isString, isEqual } from 'lodash'
import Expression from './base'

/**
 * @class RawExpression
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
    this.expr = expression
    this.name = null
    this.before = ''
    this.after = ''
    
    return this
  }
  
  /**
   * 
   * @param {String} before
   * @param {String} after
   * @returns {Raw}
   */
  wrap(before = '(', after = ')') {
    this.before = before
    this.after = after
    return this
  }
  
  /**
   * 
   * @param {String} name
   * @returns {Raw}
   */
  as(name) {
    this.name = name
    return this
  }
  
  /**
   * 
   * @param {String|Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var expr = this.expr.replace(/\?/g, compiler.parameter)
    var sql = compiler.alias(this.before + expr + this.after, this.name)
    
    // add query bindings
    this.bindings.forEach(value => compiler.addBinding(value))
    
    return sql
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(value) {
    if ( isString(expr) )
      return (this.expr === expr || this.name === expr)

    return super.isEqual() || (
      value instanceof Raw &&
      value.expr === this.expr &&
      isEqual(value.bindings, this.bindings)
    )
  }
  
}
