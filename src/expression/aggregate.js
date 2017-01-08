
/**
 * @class Aggregate
 */
export default class {
  
  /**
   * 
   * @param {String} method
   * @param {String} column
   * @param {String} name
   * @param {Boolean} isDistinct
   * @constructor
   */
  constructor(method, column, name = null, isDistinct = false) {
    this.name       = name
    this.method     = method
    this.column     = column
    this.isDistinct = isDistinct
  }
  
}