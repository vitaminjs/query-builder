
import Criterion from './basic'

/**
 * @class BetweenCriterion
 */
export default class Between extends Criterion {
  
  /**
   * 
   * @param {Expression} expr
   * @param {Any} minvalue
   * @param {Any} maxValue
   * @constructor
   */
  constructor(expr, minValue, maxValue) {
    super(expr, 'between', minValue)

    this.maxValue = maxValue
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
    return super.compile(compiler) + ` and ${compiler.parameterize(this.maxValue)}`
  }
  
}