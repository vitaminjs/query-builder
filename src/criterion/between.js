
import { isArray } from 'lodash'
import Basic from './basic'

/**
 * @class BetweenCriterion
 */
export default class Between extends Basic {
  
  /**
   * 
   * @param {String|Expression} expr
   * @param {Any} values
   * @param {String} bool
   * @param {Boolean} not
   * @constructor
   */
  constructor(expr, values, bool = 'and', not = false) {
    if (! (isArray(values) && values.length === 2) )
      throw new TypeError("Invalid values for `between` condition")
    
    super(expr, 'between', values, bool, not)
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var operand = this.operand.compile(compiler)
    var op = (this.not ? 'not ' : '') + this.op
    var value1 = compiler.parameterize(this.value[0])
    var value2 = compiler.parameterize(this.value[1])

    return `${this.bool} ${operand} ${op} ${value1} and ${value2}`
  }
  
}