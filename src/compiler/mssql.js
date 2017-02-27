
import { isEmpty, toArray, reverse } from 'lodash'
import Compiler from './base'

/**
 * @class MssqlCompiler
 */
export default class extends Compiler {
  
  /**
   * Quotes a string so it can be safely used as a table or column name
   * 
   * @param {String} value
   * @returns {String}
   */
  quote(value) {
    return (value === '*') ? value : `[${value.trim().replace(/\]/g, ']]')}]`
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

  /**
   * 
   * @param {Insert} query
   * @returns {String}
   */
  compileInsertTable(query) {
    var sql = super.compileInsertTable(query)

    return this.appendOutputClause(sql, query.getReturning())
  }

  /**
   * 
   * @param {Update} query
   * @returns {String}
   */
  compileUpdateQuery(query) {
    var table = this.escape(query.getTable())
    var sql = `update ${table} ${this.compileUpdateValues(query)}`
    
    if ( query.hasReturning() )
      sql = this.appendOutputClause(sql, query.getReturning())

    if ( query.hasConditions() )
      sql += ` ${this.compileConditions(query)}`
    
    return sql
  }

  /**
   * 
   * @param {Delete} query
   * @returns {String}
   */
  compileDeleteQuery(query) {
    var sql = `delete from ${this.escape(query.getTable())}`
    
    if ( query.hasReturning() )
      sql = this.appendOutputClause(sql, query.getReturning(), 'deleted')

    if ( query.hasConditions() )
      sql += ` ${this.compileConditions(query)}`
    
    return sql
  }

  /**
   * 
   * @param {String} sql
   * @param {String} prefix
   * @param {Array} columns
   * @returns {String}
   * @private
   */
  appendOutputClause(sql, columns, prefix = 'inserted') {
    if ( isEmpty(columns) ) return sql
    
    // add  the inserted or deleted prefix for each column
    columns = columns.map(value => {
      value = this.escape(value)
      
      if ( value.indexOf('inserted') > -1 || value.indexOf('deleted') > -1 )
        return value
      
      return `${prefix}.${value}`
    })
    
    return `${sql} output ${columns.join(', ')}`
  }
  
  /**
   * Escape function name
   * 
   * @param {String} name
   * @param {Array} args
   * @returns {String}
   */
  compileFunction(name, args = []) {
    switch ( name ) {
      case 'trim':
        return `rtrim(ltrim(${this.escape(args[0])}))`
      
      case 'substr':
        return this.compileSubstringFunction(...args)
      
      case 'length':
        return super.compileFunction('len', args)
        
      case 'strpos':
        return super.compileFunction('charindex', reverse(args.slice()))
      
      case 'repeat':
        return super.compileFunction('replicate', args)
      
      default:
        return super.compileFunction(name, args)
    }
  }
  
  /**
   * 
   * @param {Expression} expr
   * @param {Integer} start
   * @param {Integer} length
   * @returns {String}
   */
  compileSubstringFunction(expr, start, length) {
    if ( null == length ) {
      length = super.compileFunction('len', [expr])
      
      return `substring(${this.escape(expr)}, ${this.escape(start)}, ${length})`
    }
    
    return super.compileFunction('substring', toArray(arguments))
  }
  
}