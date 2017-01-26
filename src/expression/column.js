
import { isString } from 'lodash'
import Expression from './base'

/**
 * @class ColumnExpression
 */
export default class Column extends Expression {
  
  /**
   * 
   * @param {String} name
   * @param {String} table
   * @constructor
   */
  constructor(name, table = '') {
    super()
    
    this.name = name
    this.table = table
  }

  /**
   * 
   * @returns {String}
   */
  getName() {
    return (this.table ? this.table + '.' : '') + this.name
  }

  /**
   * 
   * @returns {String}
   */
  getAlias() {
    return this.alias || this.getName()
  }

  /**
   * 
   * @param {String} value
   * @returns {Column}
   */
  setTable(value) {
    this.table = table
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
