
import { isEmpty } from 'lodash'
import Compiler from './base'

/**
 * @class MssqlCompiler
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
    return '@' + this.paramCount++
  }
  
  /**
   * Escape the table or column name
   * 
   * @param {String} value
   * @returns {String}
   */
  escapeIdentifier(value) {
    return (value === '*') ? value : `[${value.trim()}]`
  }
  
  /**
   * 
   * @param {Object} query
   * @returns {String}
   */
  compileSelectComponents(query) {
    var sql = super.compileSelectComponents(query)

    if ( query.offset == null ) return sql

    return `select * from (${sql}) as t where row_count > ${query.offset}`
  }

  /**
   * Compile the query columns part
   * 
   * @param {Array} columns
   * @param {Object} query
   * @returns {String}
   */
  compileSelectColumns(columns, query) {
    columns = this.columnize(isEmpty(columns) ? ['*'] : columns)

    return this.compileTop(query) + columns + this.compileRowCount(query)
  }

  /**
   * 
   * @param {Object} query
   * @returns {String}
   */
  compileTop(query) {
    // TODO show a warning if the query doesn't contain orders
    var select = 'select ' + (query.distinct ? 'distinct ' : '')

    if ( query.limit != null )
      select += `top (${query.limit + (query.offset || 0)}) `
    
    return select
  }

  /**
   * 
   * @param {Object} query
   * @returns {String}
   */
  compileRowCount(query) {
    if ( query.offset != null ) {
      let orders = super.compileOrders(query.orders) || 'order by (select 0)'

      return `, row_number() over (${orders}) as [row_count]`
    }

    return ''
  }
  
  /**
   * 
   * @param {Array} orders
   * @param {Object} query
   * @returns {String}
   */
  compileOrders(orders, query) {
    if ( query.offset == null )
      return super.compileOrders(orders, query)
  }

  /**
   * 
   * @param {Number} limit
   * @param {Object} query
   * @returns {String}
   */
  compileLimit(limit, query) {
    // noop
  }
  
  /**
   * 
   * @param {Number} offset
   * @param {Object} query
   * @returns {String}
   */
  compileOffset(offset, query) {
    // noop
  }
  
}