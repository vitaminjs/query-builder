
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
  get parameter() {
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
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileSelectComponents(query) {
    var sql = super.compileSelectComponents(query)

    if ( query.hasOffset() ) {
      let offset = this.parameterize(query.getOffset())

      return `select * from (${sql}) as t where [row_count] > ${offset}`
    }

    return sql
  }

  /**
   * Compile the query columns part
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileSelectColumns(query) {
    var columns = query.hasColumns() ? query.getColumns() : ['*']

    return this.compileTop(query) + columns + this.compileRowCount(query)
  }

  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileTop(query) {
    // TODO show a warning if the query doesn't contain orders
    var select = 'select ' + (query.isDistinct() ? 'distinct ' : '')

    if ( query.hasLimit() ) {
      let limit = query.getLimit()
      let offset = query.getOffset() || 0

      // TODO ensure offset is number

      select += `top (${this.parameterize(limit + offset)}) `
    }
    
    return select
  }

  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileRowCount(query) {
    if (! query.hasOffset() ) return ''

    var orders = super.compileOrders(query) || 'order by (select 0)'

    return `, row_number() over (${orders}) as [row_count]`
  }
  
  /**
   * 
   * @param {Select} query
   * @returns {String}
   */
  compileOrders(query) {
    if ( query.hasOffset() ) return ''
    
    return super.compileOrders(query)
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