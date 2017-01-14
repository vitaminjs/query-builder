
/**
 * @class Criterion
 */
export default class Criterion {
  
  /**
   * 
   * @param {String} bool
   * @constructor
   */
  constructor(bool = 'and', not = false) {
    this.bool = bool
    this.not = not
  }

  /**
   * 
   * @param {Boolean} flag
   * @returns {Criterion}
   */
  negate(flag = true) {
    this.not = flag
    return this
  }

  /**
   * 
   * @param {String} value
   * @returns {Criterion}
   */
  setBoolean(value) {
    this.bool = value
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return ''
  }
  
}