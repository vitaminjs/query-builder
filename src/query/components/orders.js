
import Expression, { Order } from '../../expression'
import Container from './container'
import { isString } from 'lodash'

/**
 * @class OrderContainer
 */
export default class Orders extends Container {
  
  /**
   * 
   * @param {String|Expression} value
   * @returns {Orders}
   * @throws {TypeError}
   */
  push(value) {
    if ( isString(value) )
      value = new Order(value)
    
    if ( value instanceof Expression )
      return super.push(value)
    
    throw new TypeError("Invalid order expression")
  }
  
}