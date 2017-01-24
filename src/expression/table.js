
import { isString } from 'lodash'
import Expression from './base'

/**
 * @class TableExpression
 */
export default class Table extends Expression {
  
  /**
   * 
   * @param {String} value
   * @constructor
   */
  constructor(value) {
    super()
    
    var as = ''
    var schema = ''
    
    if ( !as && value.toLowerCase().indexOf(' as ') > 0 )
      [value, as] = value.split(' as ').map(str => str.trim())
    
    if ( !schema && value.indexOf('.') > 0 )
      [schema, value] = value.split('.').map(str => str.trim())
    
    this.alias = as
    this.schema = schema
    this.name = value
  }

  /**
   * 
   * @param {String} name
   * @returns {Table}
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
    var schema = this.schema
    var table = compiler.escapeIdentifier(this.name)
    
    if ( schema )
      schema = compiler.escapeIdentifier(this.schema) + '.'
    
    return compiler.alias(schema + table, this.alias)
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
      expr instanceof Table &&
      expr.name === this.name &&
      expr.alias === this.alias &&
      expr.schema === this.schema
    )
  }
  
}
