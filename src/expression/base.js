
/**
 * @class Expression
 */
export default class {
  
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
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    return this === expr
  }
  
}
