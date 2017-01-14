
import { Raw as Expression } from '../expression'
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
    super(bool, false)
    
    if ( expr instanceof Expression )
      throw new TypeError("Invalid `raw` condition")
    
    this.expr = expr
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return this.bool +' '+ this.expr.compile(compiler)
  }
  
}