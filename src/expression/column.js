
import Expression from './base'

/**
 * @class Column
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
  
  compile(compiler) {
    var table = this.table
    var column = compiler.escapeIdentifier(this.name)
    
    if ( table )
      table = compiler.escapeIdentifier(this.table) + '.'
    
    return compiler.alias(table + column, this.alias)
  }
  
}
