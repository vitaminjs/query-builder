
import { isEqual } from 'lodash'
import Expression from './base'

/**
 * @class FunctionExpression
 */
export default class Func extends Expression {
  
  /**
   * 
   * @param {String} name
   * @param {Expression} expr
   * @constructor
   */
  constructor(name, expr = null) {
    super()
    
    this.name = name
    this.expr = expr
  }
  
  /**
   * 
   * @param {Compiler}
   * @returns {String}
   */
  compile(compiler) {
    var expr = this.expr ? compiler.escape(this.expr) : ''
    
    return compiler.escapeFunction(this.name) + `(${expr})`
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    return super.isEqual() || (
      expr instanceof Func &&
      expr.name === this.name && 
      isEqual(this.expr, expr)
    )
  }
  
}
