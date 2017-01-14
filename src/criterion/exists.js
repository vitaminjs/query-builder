
import { SubQuery } from '../expression'
import Criterion from './base'

/**
 * @class ExistsCriterion
 */
export default class Exists extends Criterion {
  
  /**
   * 
   * @param {SubQuery} query
   * @param {String} bool
   * @param {Boolean} not
   * @constructor
   */
  constructor(query, bool = 'and', not = false) {
    super(bool, not)
    
    if (! (query instanceof SubQuery) )
      throw new TypeError("Invalid exists condition")
    
    this.query = query
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var op = (this.not ? 'not ' : '') + 'exists'
    
    return `${this.bool} ${op} (${this.query.compile(compiler)})`
  }
  
}