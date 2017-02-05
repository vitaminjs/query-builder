
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
  column(name) {
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
    var expr = compiler.quote(this.name)
    
    if ( this.schema )
      expr = compiler.quote(this.schema) + '.' + expr
    
    return compiler.alias(expr, this.alias)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    if ( isString(expr) )
      return expr === this.getName()

    return super.isEqual() || (
      expr instanceof Table && this.getName() === expr.getName()
    )
  }
  
}
