
import Expression, { SubQuery } from '../expression'
import { isArray, isEmpty } from 'lodash'
import Criterion from './base'

/**
 * @class IsInCriterion
 */
export default class IsIn extends Criterion {
  
  /**
   * 
   * @param {Expression} column
   * @param {Array|SubQuery} values
   * @constructor
   */
  constructor(expr, values) {
    super()
    
    if (!
      (expr instanceof Expression &&
      (isArray(values) || values instanceof SubQuery))
    )
      throw new TypeError("Invalid `in` condition")
    
    this.op = 'in'
    this.operand = expr
    this.values = values
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

    var operand = this.operand.compile(compiler)
    var values = compiler.parameterize(this.values)

    // wrap the array values with parentheses
    if ( isArray(this.values) ) values = `(${values})`
    
    return `${this.bool} ${operand} ${this.op} ${values}`
  }
  
}