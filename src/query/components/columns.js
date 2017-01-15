
import Expression, { Column } from '../../expression'
import Container from './container'
import { isString } from 'lodash'

/**
 * @class ColumnContainer
 */
export default class Columns extends Container {
  
  /**
   * 
   * @param {String|Expression} value
   * @returns {Columns}
   * @throws {TypeError}
   */
  push(value) {
    if ( isString(value) )
      value = new Column(value)
    
    if ( value instanceof Expression )
      return super.push(value)
    
    throw new TypeError("Invalid column expression")
  }
  
}