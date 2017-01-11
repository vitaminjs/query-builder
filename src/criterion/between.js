
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
   * @param {Boolean} negate
   * @constructor
   */
  constructor(expr, values, bool = 'and', negate = false) {
    var operator = (negate ? 'not ' : '') + 'between'
    
    super(expr, operator, values[0], bool, false)
    
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