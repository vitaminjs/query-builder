
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
    return compiler.alias(compiler.escape(this.value), this.alias)
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {Boolean}
   */
  isEqual(value) {
    return this.value === value || value === this.alias
  }

  /**
   * 
   * @returns {String}
   */
  toString() {
    return String(this.value)
  }
  
}