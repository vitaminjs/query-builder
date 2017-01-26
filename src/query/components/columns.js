
import { isString, isBoolean, isNumber } from 'lodash'
import Expression, { Literal } from '../../expression'
import Container from './container'

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
    if ( isBoolean(value) )
      value = Number(value)
    
    if ( isNumber(value) )
      value = String(value)
    
    if ( isString(value) )
      value = new Literal(value)
    
    if ( value instanceof Expression )
      return super.push(value)
    
    throw new TypeError("Invalid column expression")
  }
  
}