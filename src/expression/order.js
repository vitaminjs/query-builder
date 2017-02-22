
import Expression from './base'

/**
 * @class OrderExpression
 */
export default class Order extends Expression {
  
  /**
   * @param {Column} expr
   * @constructor
   */
  constructor(expr, direction = 'asc') {
    super()
    
    this.column = expr
    this.direction = direction
  }

  /**
   * 
   * @returns {String}
   */
  getName() {
    return this.column.getName()
  }

  /**
   * 
   * @returns {Order}
   */
  asc() {
    this.direction = 'asc'
    return this
  }

  /**
   * 
   * @returns {Order}
   */
  desc() {
    this.direction = 'desc'
    return this
  }

  /**
   * 
   * @returns {Order}
   */
  nullsFirst() {
    // TODO
  }

  /**
   * 
   * @returns {Order}
   */
  nullsLast() {
    // TODO
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    // TODO compile nulls first or last
    return this.column.compile(compiler) +' '+ this.direction
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
      expr instanceof Order && expr.getName() === this.getName() 
    )
  }

  /**
   * 
   * @returns {String}
   */
  toString() {
    return this.getName()
  }
  
}
