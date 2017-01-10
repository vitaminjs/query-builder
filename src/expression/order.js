
import Column from './column'

/**
 * @class OrderExpression
 */
export default class Order extends Column {
  
  /**
   * @param {String} column
   * @param {String} direction
   * @constructor
   */
  constructor(column, direction = 'asc') {
    super(column)
    
    this.direction = direction
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    return super.compile(compiler) +' '+ this.direction
  }
  
  /**
   * 
   * @param {Any} expr
   * @return boolean
   */
  isEqual(expr) {
    return super.isEqual() &&
      expr instanceof Order &&
      expr.direction === this.direction
  }
  
}