
import SubQuery from './sub-query'
import Expression from './base'

/**
 * @class UnionExpression
 */
export default class Union extends Expression {
  
  /**
   * @param {SubQuery} query
   * @param {Boolean} all
   * @constructor
   */
  constructor(query, all = false) {
    super()
    
    if (! (query instanceof SubQuery) )
      throw new TypeError("Invalid union query")
    
    this.query = query
    this.all = all
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return 'union ' + (this.all ? 'all ' : '') + this.query.compile(compiler)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    return super.isEqual() || (
      expr instanceof Union &&
      expr.all === this.all &&
      this.query.isEqual(expr.query)
    )
  }
  
}