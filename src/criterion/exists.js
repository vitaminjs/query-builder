
import { SubQuery } from '../expression'
import Criterion from './base'

/**
 * @class ExistsCriterion
 */
export default class Exists extends Criterion {
  
  /**
   * 
   * @param {SubQuery} query
   * @constructor
   */
  constructor(expr) {
    super()
    
    if (! (expr instanceof SubQuery) )
      throw new TypeError("Invalid exists condition")
    
    this.query = expr
    this.op = 'exists'
  }

  /**
   * 
   * @returns {Exists}
   */
  negate() {
    this.op = this.op === 'exists' ? 'not exists' : 'exists'
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return `${this.bool} ${this.op} (${this.query.compile(compiler)})`
  }
  
}