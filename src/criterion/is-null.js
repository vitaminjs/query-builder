
import Expression, { Column } from '../expression'
import { isString } from 'lodash'
import Criterion from './base'

/**
 * @class IsNullCriterion
 */
export default class IsNull extends Criterion {
  
  /**
   * 
   * @param {String|Expression} expr
   * @param {String} bool
   * @param {Boolean} not
   * @constructor
   */
  constructor(expr, bool = 'and', not = false) {
    super(bool)
    
    if ( isString(expr) )
      expr = new Column(expr)
    
    if (! (expr instanceof Expression) )
      throw new TypeError("Invalid `is null` condition")
    
    this.operand = expr
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var op = 'is' + (this.not ? ' not' : '')
    var operand = this.operand.compile(compiler)
    
    return `${this.bool} ${operand} ${op} null`
  }
  
}