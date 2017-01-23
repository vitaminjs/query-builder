
import Compiler from './base'

/**
 * @class SqliteCompiler
 */
export default class extends Compiler {
  
  /**
   * BaseCompiler constructor
   * 
   * @constructor
   */
  constructor() {
    super()

    this.bindings = []
    this.paramCount = 1
  }
  
  /**
   * Default parameter placeholder
   * 
   * @type {String}
   */
  get parameter() {
    return '$' + this.paramCount++
  }
  
  /**
   * 
   * @param {Number} offset
   * @param {Object} query
   * @returns {String}
   */
  compileOffset(offset, query) {
    if ( offset == null ) return

    var expr = 'offset ' + this.parameterize(offset)
    
    return ((query.limit == null) ? 'limit -1 ' : '') + expr
  }
  
}