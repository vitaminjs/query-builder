
/**
 * @class BaseQuery
 */
export default class Query {
  
  /**
   * 
   * @param {Builder} builder
   * @constructor
   */
  constructor(builder) {
    this.builder = builder
  }

  /**
   * 
   * @param {Compiler} Compiler
   * @returns {String}
   */
  compile(compiler) {
    return ''
  }
  
}