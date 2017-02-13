
/**
 * @class Expression
 */
export default class {

  /**
   * 
   * @constructor
   */
  constructor() {
    this.alias = ''
  }
  
  /**
   * 
   * @param {Compiler}
   * @returns {String}
   */
  compile(compiler) {
    throw new Error("Not overridden method")
  }

  /**
   * 
   * @param {String} name
   * @returns {Expression}
   */
  as(name) {
    this.alias = name
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    return this === expr
  }
  
}
