
import { isString } from 'lodash'
import Expression from './base'
import Order from './order'

/**
 * @class ColumnExpression
 */
export default class Column extends Expression {
  
  /**
   * 
   * @param {String} name
   * @constructor
   */
  constructor(name) {
    super()
    
    this.name = name
  }

  /**
   * 
   * @returns {String}
   */
  getName() {
    return this.alias || this.name
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var expr = this.name.split('.').map(s => compiler.quote(s)).join('.')
    
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
      expr instanceof Column && this.getName() === expr.getName()
    )
  }

  /**
   * 
   * @returns {Order}
   */
  asc() {
    return new Order(this, 'asc')
  }

  /**
   * 
   * @returns {Order}
   */
  desc() {
    return new Order(this, 'desc')
  }
  
}
