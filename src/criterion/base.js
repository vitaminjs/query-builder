
/**
 * @class Criterion
 */
export default class Criterion {
  
  /**
   * 
   * @param {String} bool
   * @constructor
   */
  constructor() {
    this.bool = 'and'
  }

  /**
   * 
   * @returns {Criterion}
   */
  negate() {
    // noop
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