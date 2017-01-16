
import Basic from './basic'

/**
 * @class LikeCriterion
 */
export default class Like extends Basic {

  /**
   * 
   * @param {String|Expression} expr
   * @param {String} patern
   * @param {String} bool
   * @param {Boolean} not
   * @constructor
   */
  constructor(expr, patern, bool = 'and', not = false) {
    super(expr, 'like', patern, bool, not)
  }
  
  /**
   * 
   * @param {Boolean} flag
   * @returns {Like}
   */
  negate(flag = true) {
    this.op = (flag ? 'not ' : '') + 'like'
    return super.negate()
  }
  
}