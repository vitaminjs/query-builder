
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
    // TODO enhance this method
    return super.isEqual() || (
      expr instanceof SubQuery && expr.name === this.alias
    )
  }
  
}