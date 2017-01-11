
/**
 * @class Criterion
 */
export default class {
  
  /**
   * 
   * @param {String} bool
   * @constructor
   */
  constructor(bool = 'and') {
    this.bool = bool
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    return this.bool + ' '
  }
  
}