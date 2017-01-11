
import BasicCriterion from './basic'

/**
 * @class BetweenCriterion
 */
export default class Between extends BasicCriterion {
  
  /**
   * 
   * @param {String|Expression} column
   * @param {String} operator
   * @param {Any} values
   * @param {String} bool
   * @param {Boolean} negate
   * @constructor
   */
  constructor(column, operator, values, bool = 'and', negate = false) {
    super(column, operator, values[0], bool, negate)
    
    this.value2 = values[1]
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    return super.compile(compiler) +' and '+ compiler.parameterize(this.value2)
  }
  
}