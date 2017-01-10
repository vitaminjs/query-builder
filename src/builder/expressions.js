
import { remove } from 'lodash'

/**
 * @class Expressions
 */
export default class {
  
  /**
   * 
   * @constructor
   */
  constructor() {
    this.items = []
  }
  
  get length() {
    return this.items.length
  }
  
  /**
   * 
   * @param {Expression} value
   * @return this
   */
  add(value) {
    this.items.push(value)
    return this
  }
  
  /**
   * 
   * @param {Any} value
   * @return this
   */
  remove(value) {
    remove(this.items, col => col.isEqual(value))
    return this
  }
  
  /**
   * 
   * @return this
   */
  clear() {
    this.items = []
    return this
  }
  
}