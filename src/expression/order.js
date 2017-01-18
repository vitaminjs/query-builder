
import { isString } from 'lodash'
import Column from './column'

/**
 * @class OrderExpression
 */
export default class Order extends Column {
  
  /**
   * @param {String} column
   * @constructor
   */
  constructor(column, direction = "asc") {
    if ( isString(column) && column.indexOf('-') === 0 ) {
      column = column.substr(1)
      direction = 'desc'
    }
    
    super(column)
    
    this.direction = direction
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return super.compile(compiler) +' '+ this.direction
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    if ( isString(expr) )
      return this.name === expr

    return super.isEqual() &&
      expr instanceof Order &&
      expr.direction === this.direction
  }
  
}