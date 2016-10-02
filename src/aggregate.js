
import Raw from './raw'

/**
 * @class Aggregate
 */
export default class extends Raw {
  
  /**
   * 
   * @param {String} method
   * @param {String} column
   * @param {Boolean} isDistinct
   * @constructor
   */
  constructor(method, column, isDistinct = false) {
    super(method)
    
    this.column = column
    this.isDistinct = isDistinct
  }
  
}