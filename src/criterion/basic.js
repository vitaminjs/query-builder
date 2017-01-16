
import Expression, { Column } from '../expression'
import { isString } from 'lodash'
import Criterion from './base'

/**
 * @class BasicCriterion
 */
export default class Basic extends Criterion {
  
  /**
   * 
   * @param {String|Expression} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} not
   * @constructor
   */
  constructor(expr, operator, value, bool = 'and', not = false) {
    super(bool, not)
    
    if ( isString(expr) )
      expr = new Column(expr)
    
    if (! (expr instanceof Expression) )
      throw new TypeError("Invalid condition operand")
    
    this.operand = expr
    this.value = value
    this.op = operator
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var operator = compiler.operator(this.op)
    var operand = this.operand.compile(compiler)
    var value = compiler.parameterize(this.value)
    var prefix = this.bool + (this.not ? ' not' : '')

    return `${prefix} ${operand} ${operator} ${value}`
  }
  
}