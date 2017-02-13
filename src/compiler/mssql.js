
import { isEmpty } from 'lodash'
import Compiler from './base'

/**
 * @class MssqlCompiler
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
    return '@' + this.paramCount++
  }
  
  /**
   * Quotes a string so it can be safely used as a table or column name
   * 
   * @param {String} value
   * @returns {String}
   */
  quote(value) {
    return (value === '*') ? value : `[${value.trim()}]`
  }

  /**
   * Compile the query columns part
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileSelectColumns(query) {
    return this.compileTop(query) + super.compileSelectColumns(query)
  }

  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileTop(query) {
    if ( !query.hasLimit() || query.hasOffset() ) return ''
    
    return  `top(${this.parameterize(query.getLimit())}) `
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileOrders(query) {
    var orders = super.compileOrders(query)
    
    if ( !orders && query.hasOffset() )
      orders = 'order by (select 0)' // a dummy order
    
    return orders + this.compileOffsetAndFetch(query)
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileOffsetAndFetch(query) {
    if (! query.hasOffset() ) return ''
    
    let expr = ` offset ${this.parameter(query.getOffset())} rows`
    
    if ( query.hasLimit() )
      expr += ` fetch next ${this.parameter(query.getLimit())} rows only`
    
    return expr
  }

  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileLimit(query) {
    return ''
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileOffset(query) {
    return ''
  }
  
}