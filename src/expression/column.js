
import Expression from './base'

/**
 * @class ColumnExpression
 */
export default class Column extends Expression {
  
  /**
   * 
   * @param {String} name
   * @param {String} table
   * @param {String} as
   * @constructor
   */
  constructor(name, table = '', as = '') {
    super()
    
    if ( !as && name.toLowerCase().indexOf(' as ') > 0 )
      [name, as] = name.split(' as ').map(str => str.trim())
    
    if ( !table && name.indexOf('.') > 0 )
      [table, name] = name.split('.').map(str => str.trim())
    
    this.table = table
    this.name = name
    this.alias = as
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    var table = this.table
    var column = compiler.escapeIdentifier(this.name)
    
    if ( table )
      table = compiler.escapeIdentifier(this.table) + '.'
    
    return compiler.alias(table + column, this.alias)
  }
  
  /**
   * 
   * @param {Any} expr
   * @return boolean
   */
  isEqual(expr) {
    return super.isEqual() || (
      expr instanceof Column &&
      expr.name === this.name &&
      expr.table === this.table &&
      expr.alias === this.alias
    )
  }
  
}
