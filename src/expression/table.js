
import { isString } from 'lodash'
import Expression from './base'
import Column from './column'

/**
 * @class TableExpression
 */
export default class Table extends Expression {
  
  /**
   * 
   * @param {String} name
   * @param {String} schema
   * @constructor
   */
  constructor(name, schema = '') {
    super()
    
    this.name = name
    this.schema = schema
  }

  /**
   * 
   * @returns {String}
   */
  getName() {
    return this.alias || (this.schema ? this.schema + '.' : '') + this.name
  }

  /**
   * 
   * @param {String} column
   * @returns {Field}
   */
  getColumn(name) {
    return new Column(name, this.getName())
  }

  /**
   * 
   * @param {String} value
   * @returns {Table}
   */
  setSchema(value) {
    this.schema = value
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
