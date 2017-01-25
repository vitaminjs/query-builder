
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
    this.before = ''
    this.after = ''
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
   * @param {String|Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var expr = this.expr.replace(/\?/g, compiler.parameter)
    var sql = compiler.alias(this.before + expr + this.after, this.alias)
    
    // add query bindings
    this.bindings.forEach(value => compiler.addBinding(value))
    
    return sql
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    if ( isString(expr) )
      return (this.expr === expr || this.alias === expr)

    return super.isEqual() || (
      expr instanceof Raw &&
      expr.expr === this.expr &&
      isEqual(expr.bindings, this.bindings)
    )
  }
  
}
