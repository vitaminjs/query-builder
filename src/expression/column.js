
import { isString } from 'lodash'
import Expression from './base'

/**
 * @class ColumnExpression
 */
export default class Column extends Expression {
  
  /**
   * 
   * @param {String} name
   * @constructor
   */
  constructor(value) {
    super()
    
    var as = ''
    var table = ''
    
    if ( !as && value.toLowerCase().indexOf(' as ') > 0 )
      [value, as] = value.split(' as ').map(str => str.trim())
    
    if ( !table && value.indexOf('.') > 0 )
      [table, value] = value.split('.').map(str => str.trim())
    
    this.table = table
    this.name = value
    this.alias = as
  }

  /**
   * 
   * @param {String} name
   * @returns {Column}
   */
  as(name) {
    this.alias = name
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
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
   * @returns {Boolean}
   */
  isEqual(expr) {
    if ( isString(expr) )
      return (this.alias === expr || this.name === expr)

    return super.isEqual() || (
      expr instanceof Column &&
      expr.name === this.name &&
      expr.table === this.table &&
      expr.alias === this.alias
    )
  }
  
}
