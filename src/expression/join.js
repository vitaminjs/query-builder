
import Expression from './base'

/**
 * @class JoinExpression
 */
export default class Join extends Expression {
  
  /**
   * 
   * @param {String|Table} table
   * @param {String} type
   * @param {Criteria} crirteria
   * @constructor
   */
  constructor(table, type = 'inner', criteria = null) {
    super()
    
    this.type = type
    this.table = table
    this.criteria = criteria
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var sql = this.type +' join '+ this.table.compile(compiler)
    
    if ( this.criteria != null )
      sql += ' on ' + this.criteria.compile(compiler)
    
    return sql
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    return super.isEqual() || (
      expr instanceof Join && 
      expr.type === this.type &&
      this.table.isEqual(expr.table)
    )
  }
  
}
