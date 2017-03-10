
import Expression from '../expression'
import Criterion from './base'

/**
 * @class RawCriterion
 */
export default class Raw extends Criterion {
  
  /**
   * 
   * @param {Literal} expr
   * @constructor
   */
  constructor(expr) {
    super()
    
    if (! (expr instanceof Expression) )
      throw new TypeError("Invalid `raw` condition")
    
    this.expr = expr
    this.not = false
  }

  /**
   * 
   * @returns {Raw}
   */
  negate() {
    this.not = !this.not
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var expr = this.expr.compile(compiler)

    return `${this.bool} ${this.not ? `not (${expr})` : expr}`
  }
  
}