
import { isArray, isString, toArray, remove } from 'lodash'
import Expression from '../../expression'

/**
 * @class BuilderContainer
 */
export default class Container {
  
  /**
   * 
   * @constructor
   */
  constructor() {
    this.items = []
  }
  
  /**
   * @type {Integer}
   */
  get length() {
    return this.items.length
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  isEmpty() {
    return this.length === 0
  }
  
  /**
   * 
   * @param {Array} items
   * @returns {Container}
   */
  add(items) {
    if (! isArray(items) ) items = toArray(arguments)
    
    items.forEach(value => this.push(value))
    
    return this
  }
  
  /**
   * 
   * @returns {Container}
   */
  clear() {
    this.items = []
    return this
  }
  
  /**
   * 
   * @param {Array} items
   * @returns {Container}
   */
  remove(items) {
    if (! isArray(items) ) items = toArray(arguments)
    
    // remove the given items
    items.forEach(value => remove(this.items, expr => expr.isEqual(value)))
    
    return this
  }
  
  /**
   * 
   * @returns {Array}
   */
  toArray() {
    return this.items.slice()
  }
  
  /**
   * 
   * @param {Expression} value
   * @returns {Container}
   */
  push(value) {
    if ( value instanceof Expression )
      this.items.push(value)
    
    return this
  }
  
}