
import Expression from './base'
import { Select } from '../query'

/**
 * @class SubQueryExpression
 */
export default class SubQuery extends Expression {
  
  /**
   * 
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
   * @return this
   */
  as(value) {
    this.name = value
    return this
  }
  
  /**
   * 
   * @param {Compiler}
   * @return string
   */
  compile(compiler) {
    var sql = compiler.compileSelectQuery(this.query)
    
    return compiler.alias(`(${sql})`, this.name)
  }
  
  /**
   * 
   * @param {Any} expr
   * @return boolean
   */
  isEqual(expr) {
    // TODO enhance this method
    return super.isEqual() || (
      expr instanceof SubQuery && expr.name === this.name
    )
  }
  
}