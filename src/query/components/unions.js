
import Expression, { Union } from '../../expression'
import Container from './container'
import { isString } from 'lodash'

/**
 * @class UnionContainer
 */
export default class Unions extends Container {
  
  /**
   * 
   * @param {Expression} query
   * @returns {Unions}
   * @throws {TypeError}
   */
  add(query, all = false) {
    return this.push(new Union(query, all))
  }
  
  /**
   * 
   * @param {Union} value
   * @returns {Container}
   */
  push(value) {
    if ( value instanceof Union )
      return super.push(value)
    
    throw new TypeError("Invalid union expression")
  }
  
}