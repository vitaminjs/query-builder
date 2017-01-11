
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
   * @param {Boolean} negate
   * @constructor
   */
  constructor(query, bool = 'and', negate = false) {
    super(bool)
    
    if (! (query instanceof SubQuery) )
      throw new TypeError("Invalid exists condition")
    
    this.query = query
    this.op = negate ? 'not ' : '' + 'exists'
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    var bool = super.compile(compiler)
    var operator = compiler.operator(this.op)
    
    return bool + `${operator} (${this.query.compile(compiler)})`
  }
  
}