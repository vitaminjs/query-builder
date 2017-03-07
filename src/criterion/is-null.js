
import Expression from '../expression'
import Criterion from './base'

/**
 * @class IsNullCriterion
 * @deprecated
 */
export default class IsNull extends Criterion {
  
  /**
   * 
   * @param {Expression} expr
   * @constructor
   */
  constructor(expr) {
    super()
    
    if (! (expr instanceof Expression) )
      throw new TypeError("Invalid `is null` condition")
    
    this.operand = expr
    this.op = 'is'
  }

  /**
   * 
   * @returns {Criterion}
   */
  negate() {
    this.op = (this.op === 'is') ? 'is not' : 'is'
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return `${this.bool} ${this.operand.compile(compiler)} ${this.op} null`
  }
  
}