
import Raw from './raw'

/**
 * @class Aggregate
 */
export default class extends Raw {
  
  /**
   * 
   * 
   * @param {String} method
   * @param {String} column
   * @param {Boolean} isDistinct
   * @return this aggregate
   */
  set(method, column, isDistinct = false) {
    this.isDistinct = isDistinct
    this.column = column
    super.set(method)
    return this
  }
  
  /**
   * 
   * @return string
   */
  toSQL() {
    return this.compiler.compileAggregate(this)
  }
  
}