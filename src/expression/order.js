
import { isString } from 'lodash'
import Expression from './base'

/**
 * @class OrderExpression
 */
export default class Order extends Expression {
  
  /**
   * @param {String} column
   * @constructor
   */
  constructor(column) {
    super()

    var direction = 'asc'
    
    if ( isString(column) && column.indexOf('-') === 0 ) {
      column = column.substr(1)
      direction = 'desc'
    }
    
    this.name = column
    this.direction = direction
  }

  /**
   * 
   * @returns {String}
   */
  getName() {
    return this.name
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
    return compiler.escapeIdentifier(this.name) +' '+ this.direction
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
  
}
