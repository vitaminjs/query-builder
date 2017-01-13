
import { Select } from '../query'
import Expression from './base'

/**
 * @class SubQueryExpression
 */
export default class SubQuery extends Expression {
  
  /**
   * 
   * @param {Select} query
   * @param {String} as
   * @constructor
   */
  constructor(query, as = '') {
    super()
    
    if (! (query instanceof Select) )
      throw new TypeError("Invalid sub query expression")
    
    this.query = query
    this.name = as
  }
  
  /**
   * 
   * @param {String} value
   * @returns {SubQuery}
   */
  as(value) {
    this.name = value
    return this
  }
  
  /**
   * 
   * @param {Compiler}
   * @returns {String}
   */
  compile(compiler) {
    return compiler.alias(`(${this.query.compile(compiler)})`, this.name)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    // TODO enhance this method
    return super.isEqual() || (
      expr instanceof SubQuery && expr.name === this.name
    )
  }
  
}