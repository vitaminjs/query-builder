
import { isString, isEqual } from 'lodash'
import Expression from './base'

/**
 * @class LiteralExpression
 */
export default class Literal extends Expression {
  
  /**
   * 
   * @param {String} expr
   * @param {Array} values
   * @constructor
   */
  constructor(expr, values = []) {
    super()
    
    this.values = values
    this.expr = expr
    this.before = ''
    this.after = ''
  }

  /**
   * 
   * @param {String|Expression} value
   * @returns {Literal}
   */
  static from(value) {
    return new Literal(value.toString())
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
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var values = this.values.slice()
    var expr = this.expr.replace(/\?\??/g, () => {
      return compiler.parameterize(values.shift())
    })
    
    return compiler.alias(this.before + expr + this.after, this.alias)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    if ( isString(expr) )
      return (this.expr === expr || this.alias === expr)

    // TODO compare also the values

    return super.isEqual() || (
      expr instanceof Literal &&
      expr.expr === this.expr &&
      expr.alias === this.alias
    )
  }

  /**
   * 
   * @returns {String}
   */
  toString() {
    return this.expr
  }
  
}