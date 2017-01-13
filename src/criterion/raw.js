
import { Raw as Expr } from '../expression'
import Criterion from './base'

/**
 * @class RawCriterion
 */
export default class Raw extends Criterion {
  
  /**
   * 
   * @param {Raw} expr
   * @param {String} bool
   * @constructor
   */
  constructor(expr, bool = 'and') {
    super(bool)
    
    if ( expr instanceof Expr )
      throw new TypeError("Invalid `raw` condition")
    
    this.expr = expr
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return super.compile(compiler) + this.expr.compile(compiler)
  }
  
}