
/**
 * @class Expression
 */
export default class {
  
  /**
   * 
   * @param {Compiler}
   * @return string
   */
  compile(compiler) {
    throw new Error("Not overridden method")
  }
  
  /**
   * 
   * @param {Any} expr
   * @return boolean
   */
  isEqual(expr) {
    return this === expr
  }
  
}
