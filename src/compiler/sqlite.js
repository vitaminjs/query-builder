
import Compiler from './base'

/**
 * @class SqliteCompiler
 */
export default class extends Compiler {
  
  /**
   * 
   * @param {Object} options
   * @constructor
   */
  constructor(options = {}) {
    super(options)

    this.paramCount = 1
  }
  
  /**
   * Default parameter placeholder
   * 
   * @type {String}
   */
  get placeholder() {
    return '$' + this.paramCount++
  }

  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileLimit(query) {
    if ( query.hasOffset() && !query.hasLimit() )
      return 'limit -1'
    
    return super.compileLimit(query)
  }

  /**
   * 
   * @param {Any} value
   * @param {Boolean} replaceUndefined
   * @returns {String}
   */
  parameter(value, replaceUndefined = false) {
    // sqlite does not support the `default` keyword,
    // so we replace undefined values with `null` instead
    if ( replaceUndefined && isUndefined(value) )
      return 'null'

    return super.parameter(value, replaceUndefined)
  }
  
}