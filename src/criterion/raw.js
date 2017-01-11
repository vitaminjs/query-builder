
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
    
    this.expr = expr
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    return super.compile(compiler) + this.expr.compile(compiler)
  }
  
}