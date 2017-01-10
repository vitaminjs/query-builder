
import { isString } from 'lodash'
import Expression from '../base'
import Column from '../column'

/**
 * @class CriterionExpression
 */
export default class Criterion extends Expression {
  
  /**
   * 
   * @param {String|Expression} column
   * @param {String} operator
   * @param {Any} value
   * @param {String} prefix
   * @param {Boolean} negate
   * @constructor
   */
  constructor(column, operator, value, prefix = 'and', negate = false) {
    super()
    
    if ( isString(column) ) column = new Column(column)
    
    if (! (column instanceof Expression ) )
      throw new TypeError("Invalid column expression")
    
    this.prefix = prefix
    this.negate = negate
    this.column = column
    this.value = value
    this.op = operator
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    var bool = this.prefix + ' '
    var not = this.negate ? 'not ' : ''
    var operator = compiler.operator(this.op)
    var column = this.column.compile(compiler)
    var value = compiler.parametrize(this.value)
    
    return bool + not + column + ` ${operator} ` + value
  }
  
}
