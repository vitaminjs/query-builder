
import { isArray } from 'lodash'
import Base from './base'

/**
 * @class BetweenCriterion
 */
export default class Between extends Base {
  
  /**
   * 
   * @param {Expression} expr
   * @param {Any} values
   * @constructor
   */
  constructor(expr, values) {
    super()

    if (! (isArray(values) && values.length === 2) )
      throw new TypeError("Invalid values for `between` condition")
    
    this.operand = expr
    this.op = 'between'
    this.values = values
  }

  /**
   * 
   * @returns {Between}
   */
  negate() {
    this.op = this.op === 'between' ? 'not between' : 'between'
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var operand = this.operand.compile(compiler)
    var value1 = compiler.parameterize(this.values[0])
    var value2 = compiler.parameterize(this.values[1])

    return `${this.bool} ${operand} ${this.op} ${value1} and ${value2}`
  }
  
}