
import Expression, { Column, SubQuery } from '../expression'
import { isString, isArray, isEmpty } from 'lodash'
import Criterion from './base'

/**
 * @class IsInCriterion
 */
export default class IsIn extends Criterion {
  
  /**
   * 
   * @param {String|Expression} column
   * @param {Array|SubQuery} values
   * @param {String} bool
   * @param {Boolean} not
   * @constructor
   */
  constructor(expr, values, bool = 'and', not = false) {
    super(bool, not)
    
    if ( isString(expr) ) expr = new Column(expr)
    
    if (!
      (expr instanceof Expression &&
      (isArray(values) || values instanceof SubQuery))
    )
      throw new TypeError("Invalid `in` condition")
    
    this.values = values
    this.operand = expr
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    if ( isArray(this.values) && isEmpty(this.values) )
      return `1 = ${this.not ? 1 : 0}`

    var op = (this.not ? 'not ' : '') + 'in'
    var operand = this.operand.compile(compiler)
    var values = compiler.parameterize(this.values)

    // wrap the array values with parentheses
    if ( isArray(this.values) ) values = `(${values})`
    
    return `${this.bool} ${operand} ${op} ${values}`
  }
  
}