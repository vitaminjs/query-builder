
import Compiler from './base'

/**
 * @class OracleCompiler
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
    return ':' + this.paramCount++
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileTables(query) {
    if (! query.hasTables() ) return 'from dual'
    
    return super.compileTables(query)
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileLimit(query) {
    if ( !query.hasLimit() || query.hasOffset() ) return ''
    
    return `fetch first ${this.parameter(query.getLimit())} rows only`
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileOffset(query) {
    if (! query.hasOffset() ) return ''
    
    let expr = `offset ${this.parameter(query.getOffset())} rows`
    
    if ( query.hasLimit() )
      expr += ` fetch next ${this.parameter(query.getLimit())} rows only`
    
    return expr
  }
  
  /**
   * Alias an expression
   * 
   * @param {String} first
   * @param {String} second
   * @returns {String}
   */
  alias(first, second = null) {
    return first + (second ? ' ' + this.quote(second) : '')
  }
  
}