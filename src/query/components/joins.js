
import Expression, { Join } from '../../expression'
import Container from './container'
import { isString } from 'lodash'

/**
 * @class JoinContainer
 */
export default class Joins extends Container {
  
  /**
   * 
   * @param {Expression} table
   * @param {String} type
   * @param {Criteria} criteria
   * @returns {Joins}
   */
  add(table, type = 'inner', criteria = null) {
    return this.push(new Join(table, type, criteria))
  }
  
  /**
   * 
   * @param {String|Expression} value
   * @returns {Joins}
   * @throws {TypeError}
   */
  push(value) {
    if ( value instanceof Expression )
      return super.push(value)
    
    throw new TypeError("Invalid join expression")
  }
  
}