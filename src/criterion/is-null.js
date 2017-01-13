
import { Column } from '../expression'
import { isString } from 'lodash'
import Criterion from './base'

/**
 * @class IsNullCriterion
 */
export default class IsNull extends Criterion {
  
  /**
   * 
   * @param {String|Expression} column
   * @param {String} bool
   * @param {Boolean} negate
   * @constructor
   */
  constructor(expr, bool = 'and', negate = false) {
    super(bool)
    
    if ( isString(expr) )
      expr = new Column(expr)
    
    if (! (expr instanceof Column) )
      throw new TypeError("Invalid `is null` condition")
    
    this.op = 'is' + negate ? ' not' : ''
    this.column = expr
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var bool = super.compile(compiler)
    var operator = compiler.operator(this.op)
    var column = this.column.compile(compiler)
    
    return bool + column + operator + ' null'
  }
  
}