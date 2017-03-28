
import { isString } from 'lodash'
import Expression from './base'

/**
 * @class SubQueryExpression
 */
export default class SubQuery extends Expression {
  
  /**
   * 
   * @param {Query} query
   * @constructor
   */
  constructor(query) {
    super()
    
    this.query = query
  }
  
  /**
   * 
   * @param {Compiler} compiler
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
    if ( isString(expr) )
      return expr === this.alias

    return super.isEqual() || (
      expr instanceof SubQuery && expr.alias === this.alias
    )
  }
  
}