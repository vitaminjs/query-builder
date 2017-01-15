
import Expression, { Table } from '../../expression'
import Container from './container'
import { isString } from 'lodash'

/**
 * @class TableContainer
 */
export default class Tables extends Container {
  
  /**
   * 
   * @param {String|Expression} value
   * @returns {Tables}
   * @throws {TypeError}
   */
  push(value) {
    if ( isString(value) )
      value = new Table(value)
    
    if ( value instanceof Expression )
      return super.push(value)
    
    throw new TypeError("Invalid table expression")
  }
  
}