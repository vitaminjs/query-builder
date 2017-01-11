
import Expression, { Column } from '../expression'
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
  constructor(column, bool = 'and', negate = false) {
    super(bool)
    
    if ( isString(column) ) column = new Column(column)
    
    if (! (column instanceof Expression) )
      throw new TypeError("Invalid condition expression")
    
    this.op = 'is' + negate ? ' not' : ''
    this.column = column
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    var bool = super.compile(compiler)
    var operator = compiler.operator(this.op)
    var column = this.column.compile(compiler)
    
    return bool + column + operator + ' null'
  }
  
}