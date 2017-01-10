
import SubQuery from './sub-query'
import { isString } from 'lodash'
import Expression from './base'

/**
 * @class UnionExpression
 */
export default class Union extends Expression {
  
  /**
   * @param {String} column
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
   * @return string
   */
  compile(compiler) {
    var all = this.all ? 'all ' : ''
    
    return `union ${all}${this.query.compile(compiler)}`
  }
  
  /**
   * 
   * @param {Any} expr
   * @return boolean
   */
  isEqual(expr) {
    return super.isEqual() &&
      expr instanceof Union &&
      expr.type === this.type &&
      this.query.isEqual(expr.query)
  }
  
}