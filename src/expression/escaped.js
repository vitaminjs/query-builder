
import Expression from './base'

/**
 * 
 */
export default class Escaped extends Expression {
  
  
  /**
   * 
   * @param {Any} value
   * @constructor
   */
  constructor(value) {
    super()
    
    this.value = value
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return compiler.escape(this.value)
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {Boolean}
   */
  isEqual(value) {
    return this.value === value
  }

  /**
   * 
   * @returns {String}
   */
  toString() {
    return String(this.value)
  }
  
}