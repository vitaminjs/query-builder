
import Expression, { SubQuery } from '../expression'
import { isArray, isEmpty } from 'lodash'
import Criterion from './basic'

/**
 * @class IsInCriterion
 */
export default class IsIn extends Criterion {
  
  /**
   * 
   * @param {Expression} expr
   * @param {Array|SubQuery} values
   * @constructor
   */
  constructor(expr, values) {
    if (!
      (expr instanceof Expression &&
      (isArray(values) || values instanceof SubQuery))
    )
      throw new TypeError("Invalid `in` condition")
    
    super(expr, 'in', values)
  }

  /**
   * 
   * @returns {IsIn}
   */
  negate() {
    this.op = (this.op === 'in') ? 'not in' : 'in'
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    if ( isArray(this.values) && isEmpty(this.values) )
      return `1 = ${(this.op === 'in') ? 0 : 1}`

    return super.compile(compiler)
  }
  
}