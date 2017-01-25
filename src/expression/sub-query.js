
import { Select } from '../query'
import Expression from './base'

/**
 * @class SubQueryExpression
 */
export default class SubQuery extends Expression {
  
  /**
   * 
   * @param {Select} query
   * @constructor
   */
  constructor(query) {
    super()
    
    if (! (query instanceof Select) )
      throw new TypeError("Invalid sub query expression")
    
    this.query = query
  }
  
  /**
   * 
   * @param {Compiler}
   * @returns {String}
   */
  compile(compiler) {
    return compiler.alias(`(${this.query.compile(compiler)})`, this.alias)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    // TODO enhance this method
    return super.isEqual() || (
      expr instanceof SubQuery && expr.name === this.alias
    )
  }
  
}