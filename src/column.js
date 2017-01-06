
/**
 * @class Column
 */
export default class {
  
  /**
   * 
   * @param {String} name
   * @constructor
   */
  constructor(name) {
    this.name = name
  }
  
  /**
   * @type {String}
   */
  toString() {
    return this.name
  }
  
}