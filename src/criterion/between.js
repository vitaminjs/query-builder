
import { isArray } from 'lodash'
import Criterion from './basic'

/**
 * @class BetweenCriterion
 */
export default class Between extends Criterion {
  
  /**
   * 
   * @param {Expression} expr
   * @param {Array} values
   * @constructor
   */
  constructor(expr, values) {
    if (! (isArray(values) && values.length === 2) )
      throw new TypeError("Invalid values for `between` condition")
    
    super(expr, 'between', values[0])

    this.value2 = values[1]
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
    return super.compile(compiler) + ` and ${compiler.parameterize(this.value2)}`
  }
  
}